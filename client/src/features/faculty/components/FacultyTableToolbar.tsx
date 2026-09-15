import React from "react";
import { Search, X } from "lucide-react";
import { Department, FacultyStatus } from "../types/faculty.types";

interface FacultyTableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FacultyStatus | "";
  onStatusChange: (status: FacultyStatus | "") => void;
  departmentFilter: string;
  onDepartmentChange: (departmentId: string) => void;
  departments: Department[];
  onResetFilters: () => void;
}

/**
 * Filter and Search toolbar for the Faculty directory.
 * Matches StudentTableToolbar layout and visual tokens.
 */
export default function FacultyTableToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  onResetFilters,
}: FacultyTableToolbarProps): React.JSX.Element {
  const hasActiveFilters = searchQuery.length > 0 || statusFilter !== "" || departmentFilter !== "";

  return (
    <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input: Searches facultyId, firstName, lastName, and email */}
      <div className="relative w-full sm:w-72 lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ID, name, email..."
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

      {/* Filters: Department & Status */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
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
          onChange={(e) => onStatusChange(e.target.value as FacultyStatus | "")}
          className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
        >
          <option value="" className="bg-card text-foreground">
            All statuses
          </option>
          <option value="ACTIVE" className="bg-card text-foreground">
            Active
          </option>
          <option value="INACTIVE" className="bg-card text-foreground">
            Inactive
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
