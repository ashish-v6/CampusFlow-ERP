import React from "react";
import { Link } from "react-router";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AttendanceStats } from "../types/dashboard.types";

interface AttendanceOverviewCardProps {
  stats: AttendanceStats;
  title?: string;
  subtitle?: string;
}

export default function AttendanceOverviewCard({
  stats,
  title = "Institutional Attendance Overview",
  subtitle = "Aggregated student attendance metrics across active academic sessions.",
}: AttendanceOverviewCardProps): React.JSX.Element {
  const { total, present, absent, late, percentage } = stats;

  const presentPct = total > 0 ? (present / total) * 100 : 0;
  const latePct = total > 0 ? (late / total) * 100 : 0;
  const absentPct = total > 0 ? (absent / total) * 100 : 0;

  const statusColor =
    percentage >= 75
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : percentage >= 60
      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>

        <Link
          to="/attendance"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Attendance Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attendance Rate Highlight */}
        <div className="md:col-span-1 p-5 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Attendance Rate
            </span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {percentage}%
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}
              >
                {percentage >= 75
                  ? "Good Standing"
                  : percentage >= 60
                  ? "Average"
                  : "Low Rate"}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {total} total records recorded
          </span>
        </div>

        {/* 3 Status Breakdown Cards */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Present */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Present
              </span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-foreground">{present}</div>
            <div className="text-xs text-muted-foreground">
              {presentPct.toFixed(1)}% of total records
            </div>
          </div>

          {/* Absent */}
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2">
            <div className="flex items-center justify-between text-red-600 dark:text-red-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Absent
              </span>
              <XCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-foreground">{absent}</div>
            <div className="text-xs text-muted-foreground">
              {absentPct.toFixed(1)}% of total records
            </div>
          </div>

          {/* Late */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Late
              </span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-foreground">{late}</div>
            <div className="text-xs text-muted-foreground">
              {latePct.toFixed(1)}% of total records
            </div>
          </div>
        </div>
      </div>

      {/* Visual Proportion Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Session Distribution
          </span>
          <span>{total} marked attendances</span>
        </div>

        {total === 0 ? (
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden" />
        ) : (
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${presentPct}%` }}
              title={`Present: ${presentPct.toFixed(1)}%`}
            />
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${latePct}%` }}
              title={`Late: ${latePct.toFixed(1)}%`}
            />
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${absentPct}%` }}
              title={`Absent: ${absentPct.toFixed(1)}%`}
            />
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Present ({present})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Late ({late})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Absent ({absent})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
