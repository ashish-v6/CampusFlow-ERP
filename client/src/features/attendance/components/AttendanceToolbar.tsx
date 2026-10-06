import React from "react";
import { Search, X, Calendar } from "lucide-react";
import { Department } from "../../departments/types/department.types";
import { AttendanceStatus } from "../types/attendance.types";
import { getTodayDateString } from "../utils/attendanceBadgeStyles";

interface AttendanceToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  departmentFilter: string;
  onDepartmentChange: (deptId: string) => void;
  statusFilter: AttendanceStatus | "";
  onStatusChange: (status: AttendanceStatus | "") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departments: Department[];
  onResetFilters: () => void;
}

/**
 * Filter and Search toolbar for Attendance Management.
 * Matches FacultyTableToolbar and StudentTableToolbar conventions.
 */
export default function AttendanceToolbar({
  selectedDate,
  onDateChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  departments,
  onResetFilters,
}: AttendanceToolbarProps): React.JSX.Element {
  const isDefaultDate = selectedDate === getTodayDateString();
  const hasActiveFilters =
    !isDefaultDate || departmentFilter !== "" || statusFilter !== "" || searchQuery.length > 0;

  return (
    <div className="p-4 sm:p-5 border-b border-border flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Left Section: Search Input */}
      <div className="relative w-full lg:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student ID, name..."
          className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Section: Date, Department & Status Filters */}
      <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
        {/* Date Selector */}
        <div className="relative w-full sm:w-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <input
            type="date"
            max={getTodayDateString()}
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
            title="Filter by Attendance Date"
          />
        </div>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full sm:w-44 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
        >
          <option value="" className="bg-card text-foreground">
            All departments
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id} className="bg-card text-foreground">
              {dept.name} ({dept.code})
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as AttendanceStatus | "")}
          className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
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
          <option value="LATE" className="bg-card text-foreground">
            Late
          </option>
        </select>

        {/* Reset Filter Action */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
