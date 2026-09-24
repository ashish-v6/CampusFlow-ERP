import React from "react";
import { User, Building2, CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { StudentAttendanceSummary } from "../types/attendance.types";
import { getAttendancePercentageColor } from "../utils/attendanceBadgeStyles";

interface StudentAttendanceSummaryCardProps {
  summary: StudentAttendanceSummary;
}

export default function StudentAttendanceSummaryCard({
  summary,
}: StudentAttendanceSummaryCardProps): React.JSX.Element {
  const percentageStyle = getAttendancePercentageColor(summary.percentage);
  const isShortage = summary.total > 0 && summary.percentage < 75;

  return (
    <div className="space-y-6">
      {/* Student Overview Header Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xl shrink-0">
            {summary.studentDetails.name
              ? summary.studentDetails.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "ST"}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-foreground">
                {summary.studentDetails.name}
              </h2>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                {summary.studentDetails.studentId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="w-4 h-4 text-muted-foreground/70" />
              <span>{summary.studentDetails.program || "Academic Program"}</span>
            </div>
          </div>
        </div>

        {/* Standing Indicator */}
        <div className="flex items-center gap-3">
          {summary.total > 0 && isShortage ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Low Attendance (&lt; 75%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Good Standing (&ge; 75%)</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Classes */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Classes</span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{summary.total}</div>
        </div>

        {/* Present */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Present</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{summary.present}</div>
        </div>

        {/* Absent */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Absent</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{summary.absent}</div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Attendance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-bold ${percentageStyle.text}`}>
            {summary.percentage}%
          </div>
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.percentage >= 75
                  ? "bg-emerald-500"
                  : summary.percentage >= 60
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, summary.percentage))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
