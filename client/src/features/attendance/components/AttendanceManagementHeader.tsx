import React, { useState } from "react";
import { CalendarCheck, RotateCcw, Plus, Users } from "lucide-react";

interface AttendanceManagementHeaderProps {
  onRefresh: () => Promise<void>;
  onMarkAttendance: () => void;
  onBulkMarkAttendance: () => void;
  canCreate: boolean;
}

/**
 * Top header component for the Attendance Management directory.
 * Matches StudentManagementHeader visual hierarchy, typography, and actions.
 */
export default function AttendanceManagementHeader({
  onRefresh,
  onMarkAttendance,
  onBulkMarkAttendance,
  canCreate,
}: AttendanceManagementHeaderProps): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Attendance Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Record and review daily student attendance records across programs.
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={refreshing}
          className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent border border-border rounded-xl transition-all cursor-pointer disabled:opacity-50"
          title="Refresh attendance records"
          aria-label="Refresh attendance records"
        >
          <RotateCcw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>

        {/* Bulk Mark Button (Protected: ADMIN and FACULTY only) */}
        {canCreate && (
          <button
            type="button"
            onClick={onBulkMarkAttendance}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-accent hover:bg-accent/80 text-foreground border border-border text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Users className="w-4 h-4 text-primary" />
            <span>Bulk Mark Attendance</span>
          </button>
        )}

        {/* Individual Mark Attendance Button (Protected: ADMIN and FACULTY only) */}
        {canCreate && (
          <button
            type="button"
            onClick={onMarkAttendance}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-primary/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Attendance</span>
          </button>
        )}
      </div>
    </div>
  );
}
