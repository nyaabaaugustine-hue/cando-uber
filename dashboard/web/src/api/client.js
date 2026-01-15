import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8081";
const api = axios.create({ baseURL, withCredentials: true });

export async function getCsrf() {
  const r = await api.get("/csrf");
  return r.data.csrfToken;
}

export async function login(email, password, otp) {
  const csrf = await getCsrf();
  const r = await api.post("/auth/login", { email, password, otp }, { headers: { "x-csrf-token": csrf } });
  return r.data;
}

export async function logout() {
  const csrf = await getCsrf();
  await api.post("/auth/logout", {}, { headers: { "x-csrf-token": csrf } });
}

export async function me() {
  const r = await api.get("/me");
  return r.data;
}

export async function listUsers() {
  const r = await api.get("/users");
  return r.data.users;
}

export async function createUser(user) {
  const csrf = await getCsrf();
  const r = await api.post("/users", user, { headers: { "x-csrf-token": csrf } });
  return r.data.user;
}

export async function disableUser(id) {
  const csrf = await getCsrf();
  await api.post(`/users/${id}/disable`, {}, { headers: { "x-csrf-token": csrf } });
}

export async function opsEvents() {
  const r = await api.get("/ops/events");
  return r.data;
}

export async function opsRides() {
  const r = await api.get("/ops/rides");
  return r.data;
}

export default api;
