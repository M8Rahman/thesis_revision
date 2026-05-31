// src/components/Dashboard/DashboardLayout.js
// REVISED — role-aware nav: items shown depend on on-chain role.
// Finance Ministry sees: project creation, assign CC, assign builder.
// Treasury sees:         installment transfer.
// City Corporation sees: funds transfer to builder.
// All roles see:         home, data display.
// Public link to /transparency added in header.

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { NavLink, useNavigate, Link } from "react-router-dom";
=======
import { NavLink, useLocation, useNavigate } from "react-router-dom";
>>>>>>> ffaddf21a4f1ea4582dabd4219f9d544581afc45
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

const ALL_NAV_ITEMS = [
  { path: "home",                label: "Home",                 icon: <FaHome />,           roles: ["admin","finance_ministry","treasury","city_corporation","builder","public"] },
  { path: "project-creation",    label: "Create Project",       icon: <FaProjectDiagram />, roles: ["admin","finance_ministry"] },
  { path: "city-corporation",    label: "Assign City Corp",     icon: <FaCity />,           roles: ["admin","finance_ministry"] },
  { path: "builder",             label: "Assign Builder",       icon: <FaHardHat />,        roles: ["admin","finance_ministry"] },
  { path: "installment-transfer",label: "Installment Transfer", icon: <FaMoneyCheckAlt />,  roles: ["admin","treasury"] },
  { path: "funds-transfer",      label: "Funds Transfer",       icon: <FaMoneyBillWave />,  roles: ["admin","city_corporation"] },
  { path: "data-display",        label: "Data Display",         icon: <FaTable />,          roles: ["admin","finance_ministry","treasury","city_corporation","builder"] },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme]         = useState(() => localStorage.getItem("theme") || getSystemTheme());
  const [userRole, setUserRole]   = useState("public");

  const navigate = useNavigate();
  const { accounts, detectRole }  = useWeb3();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (accounts[0]) detectRole(accounts[0]).then(setUserRole);
  }, [accounts, detectRole]);

  const visibleNav = ALL_NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem("isAuthenticated");
    navigate("/sign-in");
  };

<<<<<<< HEAD
  const roleLabel = {
    admin:            "Admin",
    finance_ministry: "Finance Ministry",
    treasury:         "Treasury",
    city_corporation: "City Corporation",
    builder:          "Builder",
    public:           "Public",
  }[userRole] ?? "Unknown";
=======
  const links = [
    { path: "/home", label: "Home", icon: <FaHome className="h-5 w-5" /> },
    {
      path: "/project-creation",
      label: "Project Creation",
      icon: <FaProjectDiagram className="h-5 w-5" />,
    },
    {
      path: "/city-corporation",
      label: "Set City Crop",
      icon: <FaCity className="h-5 w-5" />,
    },
    {
      path: "/builder",
      label: "Set Builder",
      icon: <FaHardHat className="h-5 w-5" />,
    },
    {
      path: "/installment-transfer",
      label: "Installment Transfer",
      icon: <FaMoneyCheckAlt className="h-5 w-5" />,
    },
    {
      path: "/funds-transfer",
      label: "Funds Transfer",
      icon: <FaMoneyBillWave className="h-5 w-5" />,
    },
    {
      path: "/data-display",
      label: "Data Display",
      icon: <FaTable className="h-5 w-5" />,
    },
  ];

  // Prevent navigation to the same route (fixes the issue)
  const handleNavClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
    }
  };

  // Set nav background based on theme
  const navBg =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";

  // Set top bar background based on theme
  const topBarBg = theme === "dark" ? "bg-slate-800/30" : "bg-emerald-50/80";

  // Set sidebar background based on theme
  const sidebarBg = theme === "dark" ? "bg-slate-800/30" : "bg-emerald-50/80";

  // Set border color based on theme
  const borderColor =
    theme === "dark" ? "border-slate-700/50" : "border-emerald-200";

  // Set mobile nav background based on theme
  const mobileNavBg = theme === "dark" ? "bg-slate-800/95" : "bg-emerald-50/95";

  // Set text color for logo
  const logoTextColor =
    theme === "dark" ? "text-slate-100" : "text-emerald-900";

  // Set logo background
  const logoBg =
    theme === "dark"
      ? "bg-gradient-to-br from-indigo-600 to-indigo-400"
      : "bg-gradient-to-br from-emerald-400 to-emerald-200";
>>>>>>> ffaddf21a4f1ea4582dabd4219f9d544581afc45

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className={`flex flex-col ${collapsed ? "w-16" : "w-64"} bg-slate-800/80 border-r border-slate-700/50 transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/50">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <HiBuildingLibrary className="text-cyan-400 text-2xl" />
              <span className="text-white font-bold text-sm leading-tight">GovChain<br /><span className="text-cyan-400 font-normal text-xs">Fund Management</span></span>
            </div>
          )}
          <button onClick={() => setCollapsed((c) => !c)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50">
            {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-slate-700/50">
            <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full px-2 py-0.5">
              {roleLabel}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {visibleNav.map((item) => (
            <NavLink
              key={item.path}
              to={`/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${isActive ? "bg-cyan-500/20 text-cyan-400 font-semibold" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}

          {/* Public transparency link */}
          <Link
            to="/transparency"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <span className="text-lg flex-shrink-0"><FaGlobe /></span>
            {!collapsed && <span>Public Portal</span>}
          </Link>
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-slate-700/50 space-y-1">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm"
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        {children}
      </main>
    </div>
  );
}
