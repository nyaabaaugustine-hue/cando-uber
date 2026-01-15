import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, me as apiMe } from "../api/client";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiMe().then(d => {
      setUser(d.user);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function login(email, password, otp) {
    const d = await apiLogin(email, password, otp);
    setUser(d.user);
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
