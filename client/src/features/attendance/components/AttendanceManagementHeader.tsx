import React, { useState } from "react";
import { Plus, RefreshCw, CalendarCheck } from "lucide-react";

interface AttendanceManagementHeaderProps {
  onRefresh: () => Promise<void> | void;
  onMarkAttendance?: () => void;
  canMark?: boolean;
}

/**
 * Header component for the Attendance Management directory.
 * Visual design matches UserManagementHeader, StudentManagementHeader, and FacultyManagementHeader.
 */
export default function AttendanceManagementHeader({
  onRefresh,
  onMarkAttendance,
  canMark = true,
}: AttendanceManagementHeaderProps): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Attendance
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Mark, monitor, and manage daily student academic attendance records.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2.5 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl shadow-sm hover:border-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          aria-label="Refresh attendance list"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>

        {canMark && onMarkAttendance && (
          <button
            type="button"
            onClick={onMarkAttendance}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Mark Attendance
          </button>
        )}
      </div>
    </div>
  );
}
