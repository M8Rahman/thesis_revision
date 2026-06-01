// src/components/Dashboard/Dashboard.js
// ═══════════════════════════════════════════════════════════════════════════
//  This file is UNCHANGED from the original — it was already correct.
//  Kept here for completeness.
//
//  Dashboard renders DashboardLayout and passes <Outlet /> as children.
//  React Router v6 injects the matched child route into <Outlet />, which
//  DashboardLayout renders via {children}.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
