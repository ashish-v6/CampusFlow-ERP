import React from "react";
import { Outlet, Link, useLocation } from "react-router";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "../../../components/ThemeToggle";

export default function AuthLayout(): React.JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActionButton = () => {
    if (currentPath === "/signup") {
      return (
        <Link
          to="/login"
          className="text-xs sm:text-sm font-medium text-muted-foreground border border-border hover:border-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent px-4 py-2 rounded-xl transition-all duration-200"
        >
          Sign In
        </Link>
      );
    }
    if (currentPath === "/login") {
      return (
        <Link
          to="/signup"
          className="text-xs sm:text-sm font-medium text-muted-foreground border border-border hover:border-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent px-4 py-2 rounded-xl transition-all duration-200"
        >
          Create Account
        </Link>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="text-xs sm:text-sm font-medium text-muted-foreground border border-border hover:border-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent px-3.5 py-2 rounded-xl transition-all duration-200"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="hidden sm:inline-flex text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm shadow-primary/20"
        >
          Register
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative transition-colors duration-200">
      {/* Background Subtle Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Shared Top Navigation Bar */}
      <header className="w-full h-16 shrink-0 border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: CampusFlow Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-primary/20 border border-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-xl tracking-tight text-foreground">CampusFlow</span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                ERP
              </span>
            </div>
          </Link>

          {/* Right: Navigation Links & Action Button */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                to="/home"
                className={`transition-colors duration-200 ${
                  currentPath === "/home" ? "text-primary font-semibold" : "hover:text-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`transition-colors duration-200 ${
                  currentPath === "/about" ? "text-primary font-semibold" : "hover:text-foreground"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`transition-colors duration-200 ${
                  currentPath === "/contact" ? "text-primary font-semibold" : "hover:text-foreground"
                }`}
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {getActionButton()}
            </div>
          </nav>
        </div>
      </header>

      {/* Page Content Outlet */}
      <main className="flex-1 flex flex-col w-full z-10">
        <Outlet />
      </main>

      {/* Shared Minimal Footer */}
      <footer className="w-full h-12 shrink-0 border-t border-border/60 bg-background/80 z-10 text-xs text-muted-foreground flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            &copy; {new Date().getFullYear()} CampusFlow ERP Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link
              to="/privacy"
              className={`transition-colors ${
                currentPath === "/privacy" ? "text-primary font-semibold" : "hover:text-foreground"
              }`}
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link
              to="/terms"
              className={`transition-colors ${
                currentPath === "/terms" ? "text-primary font-semibold" : "hover:text-foreground"
              }`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
