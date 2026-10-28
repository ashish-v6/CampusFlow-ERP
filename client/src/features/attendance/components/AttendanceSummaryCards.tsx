import React from "react";
import { Users, CheckCircle2, XCircle, Percent } from "lucide-react";
import { AttendanceStats } from "../types/attendance.types";

interface AttendanceSummaryCardsProps {
  stats: AttendanceStats | null;
  loading?: boolean;
}

/**
 * Summary metrics cards for Attendance module.
 * Matches visual tokens established by StudentStatsCards and UserStatsCards.
 */
export default function AttendanceSummaryCards({
  stats,
  loading = false,
}: AttendanceSummaryCardsProps): React.JSX.Element {
  const totalStudents = stats?.totalStudents ?? 0;
  const present = stats?.present ?? 0;
  const absent = stats?.absent ?? 0;
  const totalMarked = stats?.totalMarked ?? present + absent;

  // Safe percentage calculation: guards against NaN or Infinity
  const percentage =
    stats?.percentage !== undefined
      ? stats.percentage
      : totalMarked > 0
        ? Math.round((present / totalMarked) * 100 * 10) / 10
        : 0;

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Active Students */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-primary/30">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Active Students
          </span>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold text-foreground">
          {totalStudents}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Enrolled active students eligible for attendance
        </p>
      </div>

      {/* 2. Present Records */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-emerald-500/30">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Present
          </span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{present}</div>
        <p className="text-[11px] text-muted-foreground">
          Marked present for selected filter range
        </p>
      </div>

      {/* 3. Absent Records */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-rose-500/30">
        <div className="flex items-center justify-between text-rose-600 dark:text-rose-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Absent
          </span>
          <XCircle className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{absent}</div>
        <p className="text-[11px] text-muted-foreground">
          Marked absent for selected filter range
        </p>
      </div>

      {/* 4. Attendance Percentage */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-indigo-500/30">
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Attendance Rate
          </span>
          <Percent className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{percentage}%</div>
        <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
