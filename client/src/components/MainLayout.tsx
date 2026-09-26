import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  Building2,
  CalendarCheck,
  BookOpen,
  ChevronDown,
  Layers,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { logoutUser } from "../features/auth/services/auth.services";
import { useAuth } from "../context/Auth/useAuth";

export default function MainLayout(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false);
  const otherDropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPath = location.pathname;

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      auth.logout();
    }
    navigate("/login");
  };

  // Close dropdown on route change or click outside
  useEffect(() => {
    setOtherDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        otherDropdownRef.current &&
        !otherDropdownRef.current.contains(event.target as Node)
      ) {
        setOtherDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOtherDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOtherDropdownOpen(false);
    }, 150);
  };

  // Primary visible module buttons in top navbar
  const primaryNavItems = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      isActive: currentPath === "/dashboard",
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
      isActive: currentPath.startsWith("/attendance"),
      roles: ["ADMIN", "FACULTY", "STUDENT"],
    },
    {
      label: "Students",
      path: "/students",
      icon: GraduationCap,
      isActive: currentPath.startsWith("/students"),
      roles: ["ADMIN", "FACULTY"],
    },
    {
      label: "Programs",
      path: "/programs",
      icon: BookOpen,
      isActive: currentPath.startsWith("/programs"),
      roles: ["ADMIN", "FACULTY", "STUDENT"],
    },
  ];

  // Secondary modules grouped under "Other" dropdown button
  const otherNavItems = [
    {
      label: "Faculty",
      path: "/faculty",
      icon: Briefcase,
      isActive: currentPath.startsWith("/faculty"),
      roles: ["ADMIN"],
    },
    {
      label: "Departments",
      path: "/departments",
      icon: Building2,
      isActive: currentPath.startsWith("/departments"),
      roles: ["ADMIN"],
    },
    {
      label: "Users",
      path: "/users",
      icon: Users,
      isActive: currentPath.startsWith("/users"),
      roles: ["ADMIN"],
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
      isActive: currentPath.startsWith("/profile"),
    },
  ];

  const userRole = auth.user?.role?.toUpperCase() || "";

  const isItemVisible = (item: { roles?: string[] }) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  };

  const visiblePrimaryItems = primaryNavItems.filter(isItemVisible);
  const visibleOtherItems = otherNavItems.filter(isItemVisible);
  const isOtherActive = visibleOtherItems.some((item) => item.isActive);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative transition-colors duration-200">
      {/* Background Ambient Glow (Light & Dark Compatible) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <header className="w-full h-16 shrink-0 border-b border-border/80 bg-background/90 dark:bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-primary/20 border border-primary/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-xl tracking-tight text-foreground">CampusFlow</span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                ERP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {/* Primary Modules */}
            {visiblePrimaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                    item.isActive
                      ? "text-foreground bg-accent border border-border shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.isActive ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* "Other" Dropdown for Secondary Modules */}
            {visibleOtherItems.length > 0 && (
              <div
                ref={otherDropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOtherDropdownOpen((prev) => !prev)}
                  aria-expanded={otherDropdownOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    isOtherActive
                      ? "text-foreground bg-accent border border-border shadow-xs font-semibold"
                      : otherDropdownOpen
                      ? "text-foreground bg-accent/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Layers className={`w-4 h-4 ${isOtherActive ? "text-primary" : ""}`} />
                  <span>Other</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      otherDropdownOpen ? "rotate-180 text-primary" : "opacity-70"
                    }`}
                  />
                </button>

                {/* Dropdown Menu on Hover/Click */}
                {otherDropdownOpen && (
                  <div
                    className="absolute top-full right-0 mt-1.5 w-52 py-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-black/10 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-3.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Other Modules
                    </div>
                    <div className="mt-1 space-y-0.5 px-1.5">
                      {visibleOtherItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOtherDropdownOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                              item.isActive
                                ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                item.isActive ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Section: Theme Toggle, Notifications, Logout & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Notifications Button */}
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border rounded-xl transition-all relative flex items-center justify-center w-9 h-9"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-primary absolute top-2 right-2" />
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground border border-border hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 bg-accent/50 px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground bg-accent/50 border border-border rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-3 pb-4 space-y-2 animate-in slide-in-from-top-2">
            {/* Primary Mobile Items */}
            {visiblePrimaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.isActive
                      ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}

            {/* Other Mobile Items Divider */}
            {visibleOtherItems.length > 0 && (
              <div className="pt-2 pb-1">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Other Modules
                </div>
              </div>
            )}

            {visibleOtherItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.isActive
                      ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 transition-all mt-3"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        )}
      </header>

      {/* Main Page Outlet */}
      <main className="flex-1 w-full z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full h-14 shrink-0 border-t border-border bg-card/60 backdrop-blur-sm z-10 text-xs text-muted-foreground flex items-center transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} CampusFlow ERP Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link to="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
