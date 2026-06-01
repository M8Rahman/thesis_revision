// src/router/index.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED — All routing bugs corrected:
//
//  BUG 1 (CRITICAL): Route structure was wrong.
//    The "/" parent route used <Dashboard> (which renders <DashboardLayout> +
//    <Outlet>) but child routes like "home" were NOT nested under the layout's
//    outlet — the router was trying to render children as siblings, which
//    produced blank pages.
//
//    FIX: The "/" parent route renders <Dashboard> (which has <Outlet>).
//    All inner pages must be nested <Route> children so <Outlet> picks them up.
//    The index of "/" now redirects to "/home" correctly.
//
//  BUG 2 (CRITICAL): DashboardLayout nav links pointed to absolute paths
//    ("/dashboard", "/data-display", "/transparency") but the router had them
//    as RELATIVE paths under "/" ("home", "data-display"). The nav links and
//    the route paths were mismatched — clicking any nav item went to a URL that
//    had no matching route, causing blank pages.
//
//    FIX: All nav item paths in DashboardLayout.js are corrected to match the
//    routes defined here (see DashboardLayout.js fix).
//
//  BUG 3: PrivateRoute only checked localStorage for "isAuthenticated" but
//    SignIn.js correctly sets that key. This part was already correct and is
//    kept as-is.
//
//  BUG 4: Home.js imported "../images/blockchain.png" which does not exist in
//    the project file tree, causing a compile/runtime crash that silently broke
//    the Home page. Fixed in Home.js by removing the missing import.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard             from "../components/Dashboard/Dashboard";
import ProjectCreation       from "../components/ProjectCreation";
import CityCorporation       from "../pages/CityCorporation";
import InstallmentTransfer   from "../components/InstallmentTransfer";
import FundsTransfer         from "../components/FundsTransfer";
import DataDisplay           from "../components/DataDisplay";
import Builder               from "../components/Builder/Builder";
import Home                  from "../pages/Home";
import SignIn                from "../pages/SignIn";
import SignUp                from "../pages/SignUp";
import TransparencyDashboard from "../components/TransparencyPortal/TransparencyDashboard";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

const Router = () => {
    return (
        <Routes>
            {/* Auth routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Public transparency portal — no login needed */}
            <Route path="/transparency" element={<TransparencyDashboard />} />

            {/* Root redirects straight to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/*
              ── Protected dashboard shell ──────────────────────────────────
              Dashboard renders DashboardLayout which contains <Outlet />.
              Every child route below is injected into that Outlet slot.
              All nav links in DashboardLayout.js must use these exact paths.
            */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            >
                <Route path="home"                  element={<Home />} />
                <Route path="project-creation"      element={<ProjectCreation />} />
                <Route path="city-corporation"      element={<CityCorporation />} />
                <Route path="installment-transfer"  element={<InstallmentTransfer />} />
                <Route path="funds-transfer"        element={<FundsTransfer />} />
                <Route path="data-display"          element={<DataDisplay />} />
                <Route path="builder"               element={<Builder />} />
            </Route>

            {/* Catch-all: send unknown paths to sign-in */}
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
    );
};

export default Router;
