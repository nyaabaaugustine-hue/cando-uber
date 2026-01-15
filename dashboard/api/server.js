import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import csurf from "csurf";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import speakeasy from "speakeasy";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change";
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES ? parseInt(process.env.TOKEN_EXPIRES, 10) : 3600;
const ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",").map(s => s.trim());
const OPS_BASE = process.env.OPERATIONS_BASE || "http://localhost:8090";

const users = new Map();
function seedAdmin() {
  const email = "admin@local.test";
  const password = bcrypt.hashSync("Admin123!", 10);
  users.set(email, {
    id: uuid(),
    email,
    password,
    roles: ["admin"],
    enabled: true,
    twofaEnabled: false,
    twofaSecret: null
  });
}
seedAdmin();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const ok = ORIGINS.includes(origin);
    callback(null, ok);
  },
  credentials: true
}));

const loginLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
  standardHeaders: true,
  legacyHeaders: false
});

const csrfProtection = csurf({ cookie: true });
app.get("/csrf", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: TOKEN_EXPIRES * 1000
  });
}

function clearAuthCookie(res) {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
}

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes(role)) return res.status(403).json({ error: "forbidden" });
    next();
  };
}

app.post("/auth/login", loginLimiter, csrfProtection, (req, res) => {
  const { email, password, otp } = req.body || {};
  const u = users.get(String(email || "").toLowerCase());
  if (!u || !u.enabled) return res.status(401).json({ error: "invalid_credentials" });
  const ok = bcrypt.compareSync(String(password || ""), u.password);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  if (u.twofaEnabled) {
    if (!otp) return res.status(401).json({ error: "otp_required" });
    const verified = speakeasy.totp.verify({ secret: u.twofaSecret, encoding: "base32", token: String(otp) });
    if (!verified) return res.status(401).json({ error: "otp_invalid" });
  }
  const token = signToken(u);
  setAuthCookie(res, token);
  res.json({ ok: true, user: { email: u.email, roles: u.roles } });
});

app.post("/auth/logout", csrfProtection, (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get("/me", requireAuth, (req, res) => {
  res.json({ user: { email: req.user.email, roles: req.user.roles } });
});

app.get("/", (req, res) => {
  res.json({ ok: true, service: "cyber-dashboard-api" });
});

app.post("/auth/setup-2fa", requireAuth, csrfProtection, (req, res) => {
  const record = Array.from(users.values()).find(u => u.id === req.user.sub);
  if (!record) return res.status(404).json({ error: "not_found" });
  const secret = speakeasy.generateSecret({ length: 20 });
  record.twofaSecret = secret.base32;
  res.json({ otpauth: secret.otpauth_url });
});

app.post("/auth/enable-2fa", requireAuth, csrfProtection, (req, res) => {
  const record = Array.from(users.values()).find(u => u.id === req.user.sub);
  if (!record || !record.twofaSecret) return res.status(400).json({ error: "setup_required" });
  const { otp } = req.body || {};
  const verified = speakeasy.totp.verify({ secret: record.twofaSecret, encoding: "base32", token: String(otp || "") });
  if (!verified) return res.status(401).json({ error: "otp_invalid" });
  record.twofaEnabled = true;
  res.json({ ok: true });
});

app.get("/users", requireAuth, requireRole("admin"), (req, res) => {
  const list = Array.from(users.values()).map(u => ({ id: u.id, email: u.email, roles: u.roles, enabled: u.enabled }));
  res.json({ users: list });
});

app.post("/users", requireAuth, requireRole("admin"), csrfProtection, (req, res) => {
  const { email, password, roles } = req.body || {};
  const e = String(email || "").toLowerCase();
  if (users.has(e)) return res.status(409).json({ error: "exists" });
  const rec = {
    id: uuid(),
    email: e,
    password: bcrypt.hashSync(String(password || ""), 10),
    roles: Array.isArray(roles) ? roles : ["viewer"],
    enabled: true,
    twofaEnabled: false,
    twofaSecret: null
  };
  users.set(e, rec);
  res.json({ ok: true, user: { id: rec.id, email: rec.email, roles: rec.roles, enabled: rec.enabled } });
});

app.post("/users/:id/disable", requireAuth, requireRole("admin"), csrfProtection, (req, res) => {
  const rec = Array.from(users.values()).find(u => u.id === req.params.id);
  if (!rec) return res.status(404).json({ error: "not_found" });
  rec.enabled = false;
  res.json({ ok: true });
});

app.get("/ops/events", requireAuth, (req, res) => {
  fetch(`${OPS_BASE}/api/events`).then(r => r.text()).then(t => {
    res.type("application/json").send(t);
  }).catch(() => res.json([]));
});

app.get("/ops/rides", requireAuth, (req, res) => {
  fetch(`${OPS_BASE}/api/rides`).then(r => r.text()).then(t => {
    res.type("application/json").send(t);
  }).catch(() => res.json([]));
});

app.listen(PORT, () => {
  process.stdout.write(`API listening on http://localhost:${PORT}\n`);
});
