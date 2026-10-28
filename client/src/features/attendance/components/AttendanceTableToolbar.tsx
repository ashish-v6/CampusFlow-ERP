import React from "react";
import { Calendar, Filter, X, Search } from "lucide-react";
import { AttendanceStatus } from "../types/attendance.types";

interface AttendanceTableToolbarProps {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  onFromDateChange: (dateYmd: string) => void;
  onToDateChange: (dateYmd: string) => void;
  statusFilter: AttendanceStatus | "";
  onStatusChange: (status: AttendanceStatus | "") => void;
  studentSearch: string;
  onStudentSearchChange: (search: string) => void;
  onResetFilters: () => void;
  dateRangeError?: string | null;
}

/**
 * Filter toolbar for Attendance directory.
 * Supports date range filtering (From Date -> To Date), status filtering,
 * and student search.
 */
export default function AttendanceTableToolbar({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  statusFilter,
  onStatusChange,
  studentSearch,
  onStudentSearchChange,
  onResetFilters,
  dateRangeError,
}: AttendanceTableToolbarProps): React.JSX.Element {
  const hasActiveFilters =
    fromDate !== "" || toDate !== "" || statusFilter !== "" || studentSearch !== "";

  return (
    <div className="p-4 sm:p-5 border-b border-border flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Student Input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={studentSearch}
            onChange={(e) => onStudentSearchChange(e.target.value)}
            placeholder="Search student in records..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />
          {studentSearch && (
            <button
              type="button"
              onClick={() => onStudentSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group: From Date, To Date, Status */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-end">
          {/* From Date */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium shrink-0">From:</span>
            <div className="relative w-full sm:w-38">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                aria-label="From Date filter"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium shrink-0">To:</span>
            <div className="relative w-full sm:w-38">
              <input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                aria-label="To Date filter"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-32">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as AttendanceStatus | "")}
              aria-label="Filter by status"
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
            >
              <option value="" className="bg-card text-foreground">
                All statuses
              </option>
              <option value="PRESENT" className="bg-card text-foreground">
                Present
              </option>
              <option value="ABSENT" className="bg-card text-foreground">
                Absent
              </option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Range Error Message */}
      {dateRangeError && (
        <p className="text-red-500 text-xs font-medium text-right">{dateRangeError}</p>
      )}
    </div>
  );
}
