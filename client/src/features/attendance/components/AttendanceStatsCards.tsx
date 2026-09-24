import React from "react";
import { CalendarCheck, UserCheck, UserX, TrendingUp } from "lucide-react";
import { AttendanceRecord } from "../types/attendance.types";
import { getAttendancePercentageColor } from "../utils/attendanceBadgeStyles";

interface AttendanceStatsCardsProps {
  records: AttendanceRecord[];
  totalFromMeta?: number;
}

/**
 * Metric summary cards displaying statistics for the current query/date.
 * Matches FacultyStatsCards, StudentStatsCards, and DepartmentStatsCards.
 */
export default function AttendanceStatsCards({
  records,
  totalFromMeta,
}: AttendanceStatsCardsProps): React.JSX.Element {
  const total = totalFromMeta ?? records.length;
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;

  const currentCount = records.length;
  const percentage =
    currentCount > 0
      ? Number((((presentCount + lateCount) / currentCount) * 100).toFixed(1))
      : 0;

  const percentageStyle = getAttendancePercentageColor(percentage);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Marked */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Records</span>
          <CalendarCheck className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold text-foreground">{total}</div>
      </div>

      {/* 2. Present */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Present
          </span>
          <UserCheck className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{presentCount}</div>
      </div>

      {/* 3. Absent */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Absent
          </span>
          <UserX className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{absentCount}</div>
      </div>

      {/* 4. Overall Attendance Rate */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Attendance Rate</span>
          <TrendingUp className="w-4 h-4 text-indigo-500" />
        </div>
        <div className={`text-3xl font-bold ${percentageStyle.text}`}>
          {percentage}%
        </div>
      </div>
    </div>
  );
}
