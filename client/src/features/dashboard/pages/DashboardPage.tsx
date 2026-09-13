import React from "react";
import { Link } from "react-router";
import { GraduationCap, Users, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";

export default function DashboardPage(): React.JSX.Element {
  const { user } = useAuth();
  const isStudent = user?.role?.toUpperCase() === "STUDENT";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-card to-card border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUSFLOW DASHBOARD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {isStudent
              ? `Welcome back, ${user?.firstName || "Student"}!`
              : "Welcome back, Administrator!"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isStudent
              ? "Here is your campus student portal. Access your academic records, enrolled program details, and institutional profile."
              : "Here is what is happening across your campus today. Manage user records, administrative workflows, and system operations seamlessly."}
          </p>
        </div>
      </div>

      {/* Student Profile Quick Access Card (Shown for Students) */}
      {isStudent && (
        <div className="bg-card border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-card to-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">My Student Profile</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                View your institutional student ID, admission date, enrolled academic program, and personal records.
              </p>
            </div>
          </div>
          <Link
            to="/students/me"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/25 transition-all shrink-0 cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">247</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">
              +12 this month
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider font-semibold">
              Active Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">218</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">
              88.2% active status
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Suspended</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">17</div>
            <span className="text-xs text-muted-foreground font-medium">Requires admin review</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">System Health</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">99.9%</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">
              All services operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
