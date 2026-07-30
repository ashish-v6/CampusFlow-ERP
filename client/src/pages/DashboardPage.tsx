import React from "react";
import { Link, useNavigate } from "react-router";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";

export default function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative">
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Navbar */}
      <header className="w-full h-16 shrink-0 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-xl tracking-tight text-white">CampusFlow</span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ERP
              </span>
            </div>
          </Link>

          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Overview</span>
            </Link>
            <a
              href="#students"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Users className="w-4 h-4" />
              <span>Students</span>
            </a>
            <a
              href="#analytics"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </a>
            <a
              href="#settings"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </a>
          </nav>

          {/* Right: Search, Notifications & User Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="text"
                placeholder="Search portal..."
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-44 lg:w-56"
              />
            </div>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-slate-200 border border-slate-700/80 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 bg-slate-900/60 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CAMPUSFLOW DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Administrator!
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Here is what is happening across your campus today. Manage student records,
              administrative workflows, and academic operations seamlessly.
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12,480</div>
              <span className="text-xs text-emerald-400 font-medium">+4.2% from last semester</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Courses</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">342</div>
              <span className="text-xs text-emerald-400 font-medium">98.5% completion rate</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Faculty Members
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">650</div>
              <span className="text-xs text-slate-400 font-medium">Across 18 departments</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">System Health</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <span className="text-xs text-emerald-400 font-medium">All services operational</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full h-12 shrink-0 border-t border-slate-800/60 bg-slate-950/80 z-10 text-xs text-slate-500 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            &copy; {new Date().getFullYear()} CampusFlow ERP Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#privacy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </a>
            <span>&bull;</span>
            <a href="#terms" className="hover:text-slate-200 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
