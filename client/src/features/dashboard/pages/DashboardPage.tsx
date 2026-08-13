import React from "react";
import {
  GraduationCap,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function DashboardPage(): React.JSX.Element {
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
            Welcome back, Administrator!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Here is what is happening across your campus today. Manage user records,
            administrative workflows, and system operations seamlessly.
          </p>
        </div>
      </div>

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
            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">+12 this month</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider font-semibold">Active Users</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">218</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">88.2% active status</span>
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
            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">All services operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
