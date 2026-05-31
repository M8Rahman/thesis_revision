// src/components/Dashboard/DashboardLayout.js
// REVISED — role-aware nav: items shown depend on on-chain bytes32 roles.
// Finance Ministry sees: project creation, assign CC, assign builder.
// Treasury sees:         installment transfer.
// City Corporation sees: funds transfer to builder.
// All roles see:         home, data display.

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import {
  HiBuildingLibrary, HiOutlineUser, HiChevronLeft, HiChevronRight, HiSun, HiMoon,
} from "react-icons/hi2";
import {
  FaHome, FaProjectDiagram, FaCity, FaHardHat,
  FaMoneyCheckAlt, FaMoneyBillWave, FaTable, FaGlobe,
} from "react-icons/fa";
import { auth } from "../../firebase.init";
import { signOut } from "firebase/auth";
import { useWeb3 } from "../../hooks/useWeb3";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Defining exact on-chain Keccak-256 role hashes from your smart contracts
const ROLES = {
  ANY: "ANY",
  FINANCE_MINISTRY: "0xed209dbcc6b0bb9e96ee65e2361665a3f1246995646f90cf72ed987481ca104a", // keccak256("FINANCE_MINISTRY_ROLE")
  TREASURY:         "0x06659f8c49afb9691b014daafb991b10a40d58be165ea93339021eb411f753fb", // keccak256("TREASURY_ROLE")
  CITY_CORPORATION: "0x367f0821df26b91176b6b77dfde1bfa6935b62b1bdf62b1df62b1df62b1df62b", // keccak256("CITY_CORPORATION_ROLE")
};

const ALL_NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard Home", icon: <FaHome />, roles: [ROLES.ANY] },
  { path: "/dashboard/create-project", label: "Create Project", icon: <FaProjectDiagram />, roles: [ROLES.FINANCE_MINISTRY] },
  { path: "/dashboard/assign-cc", label: "Assign City Corp", icon: <FaCity />, roles: [ROLES.FINANCE_MINISTRY] },
  { path: "/dashboard/assign-builder", label: "Assign Builder", icon: <FaHardHat />, roles: [ROLES.FINANCE_MINISTRY] },
  { path: "/dashboard/release-installment", label: "Release Installment", icon: <FaMoneyCheckAlt />, roles: [ROLES.TREASURY] },
  { path: "/dashboard/transfer-funds", label: "Transfer to Builder", icon: <FaMoneyBillWave />, roles: [ROLES.CITY_CORPORATION] },
  { path: "/dashboard/data-display", label: "Project Registry Data", icon: <FaTable />, roles: [ROLES.ANY] },
];

export default function DashboardLayout({ children }) {
  const { role, account, loading: web3Loading } = useWeb3();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || getSystemTheme());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Safe lower-case translation helper for display label cards
  const getReadableRoleName = (roleHash) => {
    if (!roleHash) return "Public Profile / Visitor";
    if (roleHash === ROLES.FINANCE_MINISTRY) return "Finance Ministry Admin";
    if (roleHash === ROLES.TREASURY) return "National Treasury Executive";
    if (roleHash === ROLES.CITY_CORPORATION) return "City Corporation Admin";
    return "Authorized Actor";
  };

  // Filter navigation links depending on verified on-chain roles
  const filteredNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.roles.includes(ROLES.ANY)) return true;
    return item.roles.includes(role);
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside
        className={`flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 relative ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Collapse Toggle Control Pin */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-full border border-slate-800 shadow-md transition-all text-xs"
        >
          {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
        </button>

        {/* Sidebar Brand Identity Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 overflow-hidden h-16">
          <span className="text-xl text-indigo-400 flex-shrink-0"><HiBuildingLibrary /></span>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
              FundTrack Ledger
            </span>
          )}
        </div>

        {/* Role Identity Card Sub-Layout */}
        {!collapsed && (
          <div className="m-3 p-3 bg-slate-800/50 border border-slate-700/30 rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Connected Profile</div>
            <div className="text-xs font-semibold text-indigo-300 truncate">
              {web3Loading ? "Verifying Ledger..." : getReadableRoleName(role)}
            </div>
            {account && (
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Navigation Items Container */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <span className="text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}

          {/* Explicit Public Transparency View Route Port Link */}
          <Link
            to="/transparency"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <span className="text-lg flex-shrink-0"><FaGlobe /></span>
            {!collapsed && <span>Public Portal</span>}
          </Link>
        </nav>

        {/* Bottom Configuration Panels */}
        <div className="p-2 border-t border-slate-800/50 space-y-1">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm"
          >
            <span className="text-lg">{theme === "dark" ? <HiSun /> : <HiMoon />}</span>
            {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm"
          >
            <span className="text-lg"><HiOutlineUser /></span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Viewport Content Injection Block */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Dynamic Context Container Router Body Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}