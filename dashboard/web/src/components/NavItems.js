export const NAV_ITEMS = [
  { path: "/", label: "Overview", roles: ["admin", "dispatcher", "viewer"] },
  { path: "/live", label: "Live Ops", roles: ["admin", "dispatcher"] },
  { path: "/map", label: "Map", roles: ["admin", "dispatcher"] },
  { path: "/analytics", label: "Analytics", roles: ["admin"] },
  { path: "/users", label: "Users", roles: ["admin"] },
  { path: "/transactions", label: "Transactions", roles: ["admin", "dispatcher"] },
  { path: "/logs", label: "Logs", roles: ["admin", "dispatcher"] }
];
