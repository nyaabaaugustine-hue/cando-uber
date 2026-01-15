import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./auth/RoleGuard";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import LiveOps from "./pages/LiveOps";
import MapView from "./pages/MapView";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Drivers from "./pages/Drivers";
import Transactions from "./pages/Transactions";
import Logs from "./pages/Logs";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="live" element={<RoleGuard role="dispatcher"><LiveOps /></RoleGuard>} />
        <Route path="map" element={<RoleGuard role="dispatcher"><MapView /></RoleGuard>} />
        <Route path="analytics" element={<RoleGuard role="admin"><Analytics /></RoleGuard>} />
        <Route path="users" element={<RoleGuard role="admin"><Users /></RoleGuard>} />
        <Route path="drivers" element={<RoleGuard role="dispatcher"><Drivers /></RoleGuard>} />
        <Route path="transactions" element={<RoleGuard role="dispatcher"><Transactions /></RoleGuard>} />
        <Route path="logs" element={<RoleGuard role="dispatcher"><Logs /></RoleGuard>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
