import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@local.test");
  const [password, setPassword] = useState("Admin123!");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      await login(email, password, otp || undefined);
      nav("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  }
  return (
    <div className="grid place-items-center min-h-screen p-4">
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-3">
            <input
              className="h-9 rounded-md border px-3 bg-white dark:bg-neutral-900"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="h-9 rounded-md border px-3 bg-white dark:bg-neutral-900"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              className="h-9 rounded-md border px-3 bg-white dark:bg-neutral-900"
              placeholder="OTP (if enabled)"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
