// src/components/Dashboard/DashboardLayout.js
// ═══════════════════════════════════════════════════════════════════════════
//  ROOT CAUSE ANALYSIS — why pages were still blank after v2 fixes:
//
//  BUG A (CRITICAL — blank pages): DashboardLayout renders {children} at
//    line 1860 of the original. But Dashboard.js wraps it like this:
//      <DashboardLayout><Outlet /></DashboardLayout>
//    React Router's <Outlet /> injects matched child route content.
//    This WORKED in principle, but `useWeb3` was crashing before render
//    completed (see BUG C below), so `{children}` (the Outlet) never painted.
//
//  BUG B (CRITICAL — all nav items invisible except Home + Data):
//    ALL_NAV_ITEMS path values are STILL WRONG in the original:
//      "/dashboard"    → should be "/home"
//      "/create-project" → should be "/project-creation"
//      "/assign-cc"    → should be "/city-corporation"
//      "/assign-builder" → should be "/builder"
//      "/release-installment" → should be "/installment-transfer"
//      "/transfer-funds" → should be "/funds-transfer"
//    None of these paths match any <Route> in router/index.js so every click
//    goes to a URL with no route → blank page.
//
//  BUG C (CRITICAL — "Verifying Ledger..." stuck forever + no MetaMask popup):
//    useWeb3 called window.ethereum.request({method:"eth_requestAccounts"}).
//    The console log shows:
//      "Me: Unexpected error at r.request (evmAsk.js) at r.selectExtension"
//    This is thrown by the MetaMask extension conflict resolver (evmAsk.js).
//    It happens when TWO OR MORE wallet extensions are installed. The browser
//    shows a wallet-picker popup; if it errors out, the entire `init()` throws
//    BEFORE setting loading=false → loading stays `true` forever →
//    DashboardLayout shows "Verifying Ledger..." permanently.
//    Fixed in useWeb3.js by using getMetaMaskProvider() which bypasses the
//    conflict by reading window.ethereum.providers[] directly.
//
//  BUG D: handleSignOut navigated to "/signin" (no hyphen) but the route
//    is "/sign-in" (with hyphen) → sign out sent user to a blank page.
//
//  BUG E: getReadableRoleName() compared against bytes32 hash strings
//    (ROLES.FINANCE_MINISTRY etc.) but useWeb3 now returns human strings
//    ("finance_ministry"). The role card always showed "Authorized Actor".
//    Fixed by comparing against the string values.
//
//  BUG F: No "Connect Wallet" button. If MetaMask auto-connection fails,
//    the user had no way to trigger it manually.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  HiBuildingLibrary,
  HiOutlineArrowRightOnRectangle,
  HiChevronLeft,
  HiChevronRight,
  HiSun,
  HiMoon,
} from "react-icons/hi2";
import {
  FaHome, FaProjectDiagram, FaCity, FaHardHat,
  FaMoneyCheckAlt, FaMoneyBillWave, FaTable, FaGlobe,
  FaWallet,
} from "react-icons/fa";
import { auth } from "../../firebase.init";
import { signOut } from "firebase/auth";
import { useWeb3 } from "../../hooks/useWeb3";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// ── Nav items ─────────────────────────────────────────────────────────────
// RULE: `path` must exactly match the <Route path="..."> in router/index.js
// RULE: `roles` must exactly match strings from useWeb3().role
//       Use ["ANY"] to show item to all authenticated users regardless of role
const ALL_NAV_ITEMS = [
  {
    path: "/home",
    label: "Dashboard Home",
    icon: <FaHome />,
    roles: ["ANY"],
  },
  {
    path: "/project-creation",        // ← was "/create-project" (WRONG)
    label: "Create Project",
    icon: <FaProjectDiagram />,
    roles: ["finance_ministry", "admin"],
  },
  {
    path: "/city-corporation",        // ← was "/assign-cc" (WRONG)
    label: "Assign City Corp",
    icon: <FaCity />,
    roles: ["finance_ministry", "admin"],
  },
  {
    path: "/builder",                 // ← was "/assign-builder" (WRONG)
    label: "Assign Builder",
    icon: <FaHardHat />,
    roles: ["finance_ministry", "admin"],
  },
  {
    path: "/installment-transfer",    // ← was "/release-installment" (WRONG)
    label: "Release Installment",
    icon: <FaMoneyCheckAlt />,
    roles: ["treasury", "admin"],
  },
  {
    path: "/funds-transfer",          // ← was "/transfer-funds" (WRONG)
    label: "Transfer to Builder",
    icon: <FaMoneyBillWave />,
    roles: ["city_corporation", "admin"],
  },
  {
    path: "/data-display",            // ✓ this one was already correct
    label: "Project Registry Data",
    icon: <FaTable />,
    roles: ["ANY"],
  },
];

export default function DashboardLayout({ children }) {
  // useWeb3 now resolves loading=false after full init (see useWeb3.js fix)
  const { role, account, loading: web3Loading, isConnected, connectWallet } = useWeb3();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || getSystemTheme()
  );
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isAuthenticated"); // clear PrivateRoute gate
      navigate("/sign-in"); // ← was "/signin" (WRONG — caused blank page on sign out)
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // BUG E FIX: compare against human-readable strings, not bytes32 hashes
  const getReadableRoleName = (r) => {
    const labels = {
      admin:            "System Administrator",
      finance_ministry: "Finance Ministry",
      treasury:         "National Treasury",
      city_corporation: "City Corporation",
      builder:          "Registered Builder",
      public:           "Public / Visitor",
    };
    return labels[r] || "Authenticated User";
  };

  const filteredNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.roles.includes("ANY")) return true;
    return item.roles.includes(role);
  });

  const shortAddress = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : null;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`flex flex-col flex-shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 relative z-20 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-6 bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-full border-2 border-slate-900 shadow-lg text-xs z-30"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
        </button>

        {/* Brand header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center gap-3 overflow-hidden">
          <HiBuildingLibrary className="text-indigo-400 text-xl flex-shrink-0" />
          {!collapsed && (
            <span className="font-semibold text-sm tracking-wide text-white truncate">
              FundTrack Ledger
            </span>
          )}
        </div>

        {/* ── Wallet / profile card ───────────────────────────────────────── */}
        {!collapsed && (
          <div className="m-3 p-3 bg-slate-800/60 border border-slate-700/40 rounded-xl space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Connected Profile
            </p>

            {/* BUG C FIX: spinner instead of permanent "Verifying Ledger..." */}
            {web3Loading ? (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Connecting…</span>
              </div>
            ) : isConnected ? (
              <>
                <p className="text-xs font-semibold text-indigo-300 truncate">
                  {getReadableRoleName(role)}
                </p>
                {shortAddress && (
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {shortAddress}
                  </p>
                )}
              </>
            ) : (
              /* BUG F FIX: Connect Wallet button when wallet not connected */
              <>
                <p className="text-xs text-amber-400 font-medium">
                  Wallet not connected
                </p>
                <button
                  onClick={connectWallet}
                  className="flex items-center justify-center gap-1.5 w-full px-2 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <FaWallet className="text-xs" />
                  Connect MetaMask
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`
              }
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}

          {/* Public portal — always visible */}
          <Link
            to="/transparency"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <FaGlobe className="text-base flex-shrink-0" />
            {!collapsed && <span>Public Portal</span>}
          </Link>
        </nav>

        {/* ── Bottom controls ──────────────────────────────────────────────── */}
        <div className="p-2 border-t border-slate-800/50 space-y-0.5">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm"
          >
            {theme === "dark"
              ? <HiSun className="text-base flex-shrink-0" />
              : <HiMoon className="text-base flex-shrink-0" />}
            {!collapsed && (
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm"
          >
            <HiOutlineArrowRightOnRectangle className="text-base flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/*
              This renders the matched child route injected by React Router's
              <Outlet /> in Dashboard.js. This is how the actual page content
              (Home, DataDisplay, ProjectCreation, etc.) appears here.
            */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
