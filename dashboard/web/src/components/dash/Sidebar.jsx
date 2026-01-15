import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../NavItems";
import {
  LayoutDashboard,
  ActivitySquare,
  Map as MapIcon,
  BarChart3,
  Users as UsersIcon,
  FileText,
  Receipt,
} from "lucide-react";

function iconFor(path) {
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
}

export default function Sidebar({ items }) {
  const location = useLocation();
  return (
    <aside className="duration-175 linear fixed z-50 h-full w-[260px] bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:bg-navy-800 dark:text-white border-r border-gray-200 dark:border-white/10">
      <div className="mx-[24px] mt-[26px] flex items-center">
        <div className="mt-1 ml-1 text-[20px] font-bold uppercase text-navy-700 dark:text-white">
          Horizon <span className="font-medium">FREE</span>
        </div>
      </div>
      <div className="mt-6 mb-4 h-px bg-gray-300 dark:bg-white/30" />
      <nav className="px-3 space-y-1">
        {items.map((i) => {
          const Icon = iconFor(i.path);
          const active = location.pathname === i.path;
          return (
            <Link
              key={i.path}
              to={i.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                active
                  ? "bg-gray-100 text-navy-700 dark:bg-navy-900 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-brandLinear" : "text-gray-500 dark:text-white/70"}`} />
              <span>{i.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
