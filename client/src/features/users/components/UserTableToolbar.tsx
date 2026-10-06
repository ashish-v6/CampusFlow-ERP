import React from "react";
import { Search, X } from "lucide-react";

interface UserTableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: string;
  onRoleChange: (role: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  onResetFilters: () => void;
}

export default function UserTableToolbar({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
}: UserTableToolbarProps): React.JSX.Element {
  const hasActiveFilters = searchQuery.length > 0 || roleFilter !== "" || statusFilter !== "";

  return (
    <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:w-72 lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email..."
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

      {/* Role & Status Selectors */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
        >
          <option value="" className="bg-card text-foreground">
            All roles
          </option>
          <option value="ADMIN" className="bg-card text-foreground">
            Admin
          </option>
          <option value="FACULTY" className="bg-card text-foreground">
            Faculty
          </option>
          <option value="STUDENT" className="bg-card text-foreground">
            Student
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
        >
          <option value="" className="bg-card text-foreground">
            All statuses
          </option>
          <option value="ACTIVE" className="bg-card text-foreground">
            Active
          </option>
          <option value="SUSPENDED" className="bg-card text-foreground">
            Suspended
          </option>
          <option value="INACTIVE" className="bg-card text-foreground">
            Inactive
          </option>
        </select>

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
