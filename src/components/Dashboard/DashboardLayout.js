import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HiBuildingLibrary,
  HiOutlineUser,
  HiChevronLeft,
  HiChevronRight,
  HiSun,
  HiMoon,
} from "react-icons/hi2";
import {
  FaHome,
  FaProjectDiagram,
  FaCity,
  FaHardHat,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaTable,
} from "react-icons/fa";
import { auth } from "../../firebase.init";
import { signOut } from "firebase/auth";

// Helper to get system color scheme
function getSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

function DashboardLayout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme state: "light" or "dark"
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || getSystemTheme();
    }
    return "dark";
  });

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('isAuthenticated');
        navigate("/sign-in");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };


  // Apply theme to <html> element
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const links = [
    { path: "/home", label: "Dashboard", icon: <FaHome className="h-5 w-5" /> },
    {
      path: "/project-creation",
      label: "Project Creation",
      icon: <FaProjectDiagram className="h-5 w-5" />,
    },
    {
      path: "/city-corporation",
      label: "City Corporation",
      icon: <FaCity className="h-5 w-5" />,
    },
    {
      path: "/builder",
      label: "Builder",
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

  return (
    <div className={`fixed inset-0 z-50 w-full h-screen ${navBg} flex flex-col`}>
      {/* Animated background layer (nodes + connecting lines) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Network nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-blue-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-indigo-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-violet-400 rounded-full animate-pulse delay-500"></div>

        {/* Connecting lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="80"
            y1="80"
            x2="200"
            y2="160"
            stroke="url(#gradient1)"
            strokeWidth="1"
            className="animate-pulse"
          />
          <line
            x1="200"
            y1="160"
            x2="320"
            y2="240"
            stroke="url(#gradient2)"
            strokeWidth="1"
            className="animate-pulse delay-300"
          />
          <line
            x1="160"
            y1="480"
            x2="280"
            y2="400"
            stroke="url(#gradient3)"
            strokeWidth="1"
            className="animate-pulse delay-700"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating particles */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping delay-1000"></div>
      </div>
      <div className="flex flex-col h-full w-full relative z-10">
        {/* Top bar: Logo and account actions */}
        <div
          className={`flex h-16 items-center gap-4 px-6 ${borderColor} border-b ${topBarBg} backdrop-blur-md`}
        >
          {/* Left: Logo */}
          <div
            className={`flex items-center shrink-0 transition-all duration-300 ${
              collapsed ? "gap-0" : "gap-3"
            }`}
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${logoBg} text-white shadow-md`}
            >
              <HiBuildingLibrary className="h-6 w-6" />
            </span>
            <span
              className={`text-xl font-bold tracking-wide ${logoTextColor} transition-all duration-300 overflow-hidden ${
                collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
              }`}
            >
              GovtChain
            </span>
          </div>

          {/* Right: Account actions */}
          <div className="ml-auto flex items-center gap-3">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${
                theme === "dark"
                  ? "bg-slate-700/40 text-slate-200 hover:bg-slate-700/60"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50`}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              style={{ fontSize: 20 }}
            >
              {theme === "dark" ? (
                <HiSun className="h-5 w-5 text-yellow-300" />
              ) : (
                <HiMoon className="h-5 w-5 text-emerald-700" />
              )}
            </button>

            {/* User dropdown with Sign out */}
            <div className="relative group">
              <button
                onClick={handleSignOut}
                className={`hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                  theme === "dark"
                    ? "bg-slate-700/40 text-slate-200"
                    : "bg-emerald-100 text-emerald-700"
                } backdrop-blur-sm`}
                aria-haspopup="true"
                aria-expanded="false"
                tabIndex={0}
              >
                <HiOutlineUser className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main nav: Full screen vertical nav for desktop, horizontal for mobile */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Desktop: Vertical nav */}
          <div
            className={`hidden md:flex flex-col transition-all duration-300 ease-in-out ${sidebarBg} backdrop-blur-md ${borderColor} border-r h-full relative ${
              collapsed ? "w-20" : "w-72"
            }`}
          >
            {/* Collapse/Expand Button */}
            <button
              className="absolute -right-4 top-4 z-20 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full p-2 transition-all duration-200 border border-indigo-400/50 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-400/40 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <HiChevronRight className="h-4 w-4" />
              ) : (
                <HiChevronLeft className="h-4 w-4" />
              )}
            </button>

            {/* Navigation Links */}
            <div className={`${collapsed ? "px-2" : "px-6"} mt-4`}>
              {/* Remove shadow from ul */}
              <ul className="space-y-1 shadow-none">
                {links.map((l) => (
                  <li key={l.path}>
                    <NavLink
                      to={l.path}
                      end
                      className={({ isActive }) =>
                        `group flex items-center w-full text-left rounded-xl text-white focus:ring-indigo-400/50 relative ${
                          collapsed
                            ? "px-3 py-2.5 justify-center"
                            : "px-4 py-2.5 gap-3"
                        } ${
                          isActive
                            ? theme === "dark"
                              ? "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-indigo-500/25 transform scale-[1.02] "
                              : "text-emerald-900 bg-gradient-to-r from-emerald-200 to-emerald-100 shadow-lg shadow-emerald-200/25 transform scale-[1.02]"
                            : theme === "light"
                            ? "!text-black hover:bg-slate-700/50 hover:transform hover:scale-[1.01]"
                            : "text-emerald-700 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[1.01]"
                        }`
                      }
                      onClick={(e) => handleNavClick(e, l.path)}
                      title={collapsed ? l.label : undefined}
                    >
                      <span
                        className={`flex-shrink-0 ${
                          collapsed ? "" : "text-lg"
                        }`}
                      >
                        {l.icon}
                      </span>
                      <span
                        className={`text-sm text-black dark:text-white tracking-wide transition-all duration-300 ${
                          collapsed
                            ? "w-0 opacity-0 overflow-hidden"
                            : "w-auto opacity-100"
                        }`}
                      >
                        {l.label}
                      </span>
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div
                          className={`absolute left-full ml-3 px-3 py-1.5 ${
                            theme === "dark"
                              ? "bg-slate-800 text-white border-slate-600/50"
                              : "bg-emerald-50 text-emerald-900 border-emerald-200"
                          } text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border z-30`}
                        >
                          {l.label}
                          <div
                            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 ${
                              theme === "dark"
                                ? "bg-slate-800 border-l border-b border-slate-600/50"
                                : "bg-emerald-50 border-l border-b border-emerald-200"
                            } rotate-45`}
                          ></div>
                        </div>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content: Render nested route UI here */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>

        {/* Mobile: Horizontal nav at bottom */}
        <div
          className={`md:hidden fixed bottom-0 left-0 w-full p-3 ${mobileNavBg} backdrop-blur-md ${borderColor} border-t z-50`}
        >
          <div className="flex overflow-x-auto pb-1 space-x-2 hide-scrollbar">
            {links.slice(0, 4).map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium min-w-max transition-all duration-200 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30"
                        : "bg-gradient-to-r from-emerald-200 to-emerald-100 text-emerald-900 shadow-md shadow-emerald-200/30"
                      : theme === "dark"
                      ? "text-slate-300 bg-slate-700/60 hover:bg-slate-700/80 hover:text-white"
                      : "text-emerald-700 bg-emerald-100 hover:bg-emerald-200 hover:text-emerald-900"
                  }`
                }
                onClick={(e) => handleNavClick(e, l.path)}
              >
                <span className="mb-1">{l.icon}</span>
                <span>{l.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default DashboardLayout;
