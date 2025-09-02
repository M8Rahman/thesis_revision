import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { HiBuildingLibrary, HiOutlineUser } from "react-icons/hi2";
import { 
  FaHome, 
  FaProjectDiagram, 
  FaCity, 
  FaHardHat, 
  FaMoneyCheckAlt, 
  FaMoneyBillWave, 
  FaTable 
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: "/home", label: "Home", icon: <FaHome className="h-5 w-5" /> },
    { path: "/project-creation", label: "Project Creation", icon: <FaProjectDiagram className="h-5 w-5" /> },
    { path: "/city-corporation", label: "City Corporation", icon: <FaCity className="h-5 w-5" /> },
    { path: "/builder", label: "Builder", icon: <FaHardHat className="h-5 w-5" /> },
    { path: "/installment-transfer", label: "Installment Transfer", icon: <FaMoneyCheckAlt className="h-5 w-5" /> },
    { path: "/funds-transfer", label: "Funds Transfer", icon: <FaMoneyBillWave className="h-5 w-5" /> },
    { path: "/data-display", label: "Data Display", icon: <FaTable className="h-5 w-5" /> },
  ];

  const baseItem = "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2";
  const idleItem = "text-slate-300 hover:text-white hover:bg-slate-700/50";
  const activeItem = "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/20";

  // Prevent navigation to the same route (fixes the issue)
  const handleNavClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
    }
  };

  return (
    <nav className="fixed inset-0 z-50 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex flex-col h-full w-full">
        {/* Top bar: Logo and account actions */}
        <div className="flex h-16 items-center gap-4 px-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 text-white shadow-md">
              <HiBuildingLibrary className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold tracking-wide text-slate-100">
              GovtChain
            </span>
          </div>

          {/* Right: Account actions */}
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/40 text-slate-200 backdrop-blur-sm">
              <HiOutlineUser className="h-5 w-5" />
            </span>

            <NavLink
              to="/sign-in"
              className={({ isActive }) =>
                `${baseItem} ${
                  isActive
                    ? "bg-slate-700/50 text-white ring-1 ring-slate-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                }`
              }
              onClick={e => handleNavClick(e, "/sign-in")}
            >
              Sign in
            </NavLink>

            <NavLink
              to="/sign-up"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:from-emerald-600 hover:to-emerald-500 shadow-md hover:shadow-emerald-500/30"
                }`
              }
              onClick={e => handleNavClick(e, "/sign-up")}
            >
              Sign up
            </NavLink>
          </div>
        </div>

        {/* Main nav: Full screen vertical nav for desktop, horizontal for mobile */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Desktop: Vertical nav */}
          <div className="hidden md:flex flex-col py-8 px-6 w-72 bg-slate-800/30 backdrop-blur-md border-r border-slate-700/50 h-full">
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.path}>
                  <NavLink
                    to={l.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full text-left ${baseItem} ${isActive ? activeItem : idleItem}`
                    }
                    onClick={e => handleNavClick(e, l.path)}
                  >
                    {l.icon}
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Main content: Render nested route UI here */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
            <Outlet />
          </div>
        </div>

        {/* Mobile: Horizontal nav at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 w-full p-3 bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50 z-50">
          <div className="flex overflow-x-auto pb-1 space-x-2 hide-scrollbar">
            {links.slice(0, 4).map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium min-w-max ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-slate-300 bg-slate-700/60"}`
                }
                onClick={e => handleNavClick(e, l.path)}
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
    </nav>
  );
}

export default Dashboard;