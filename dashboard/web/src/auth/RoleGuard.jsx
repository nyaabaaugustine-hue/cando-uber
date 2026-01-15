import React from "react";
import { useAuth } from "./AuthContext";

export default function RoleGuard({ role, children }) {
  const { user } = useAuth();
  if (!user || !user.roles || !user.roles.includes(role)) return null;
  return children;
}
