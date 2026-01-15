import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "./NavItems";
import { useAuth } from "../auth/AuthContext";
import Button from "./ui/button";
import DashSidebar from "./dash/Sidebar";
import DashNavbar from "./dash/Navbar";
import {
  LayoutDashboard,
  ActivitySquare,
  Map as MapIcon,
  BarChart3,
  Users as UsersIcon,
  FileText,
  Receipt,
} from "lucide-react";

export default function Layout() {
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();
  const items = useMemo(() => NAV_ITEMS.filter(i => i.roles.some(r => user?.roles?.includes(r))), [user]);
  const location = useLocation();
  const envLabel = (import.meta.env.MODE === "production") ? "Live" : "Stage";
  const userInitial = (user?.email || "U").charAt(0).toUpperCase();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const iconFor = (path) => {
    switch (path) {
      case "/":
        return LayoutDashboard;
      case "/live":
        return ActivitySquare;
      case "/map":
        return MapIcon;
      case "/analytics":
        return BarChart3;
      case "/users":
        return UsersIcon;
      case "/logs":
        return FileText;
      case "/transactions":
        return Receipt;
      default:
        return LayoutDashboard;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <DashNavbar brand="Cyber Dashboard" envLabel={envLabel} dark={dark} setDark={setDark} userInitial={userInitial} onLogout={logout} />
      <DashSidebar items={items} />
      <main className="p-6 ml-[260px]">
        <Outlet />
      </main>
    </div>
  );
}
