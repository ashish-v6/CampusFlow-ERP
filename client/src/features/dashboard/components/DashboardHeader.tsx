import React, { useState } from "react";
import { RefreshCw, LayoutDashboard, Calendar, Building2, X } from "lucide-react";
import { Department } from "../../departments/types/department.types";

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  onRefresh: () => Promise<void> | void;
  departments: Department[];
  departmentFilter: string;
  onDepartmentChange: (deptId: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onResetFilters: () => void;
  hasFilters: boolean;
  canFilterDepartment?: boolean;
}

export default function DashboardHeader({
  userName,
  userRole,
  onRefresh,
  departments,
  departmentFilter,
  onDepartmentChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onResetFilters,
  hasFilters,
  canFilterDepartment = true,
}: DashboardHeaderProps): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {userRole}
            </span>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Welcome back, <span className="font-semibold text-foreground">{userName}</span>. Here is your institutional campus overview.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl shadow-sm hover:border-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label="Refresh dashboard data"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Visible for Admin and Faculty) */}
      {canFilterDepartment && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase tracking-wider text-[11px] self-start sm:self-auto">
            <span>Filter Metrics:</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            {/* Department Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={departmentFilter}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer text-xs"
              >
                <option value="" className="bg-card text-foreground">
                  All departments
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-card text-foreground">
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <span className="text-muted-foreground text-[11px]">From:</span>
              <input
                type="date"
                value={startDate}
                max={endDate && endDate < today ? endDate : today}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="px-2.5 py-1.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-xs cursor-pointer"
                title="Start Date"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <span className="text-muted-foreground text-[11px]">To:</span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={today}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="px-2.5 py-1.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-xs cursor-pointer"
                title="End Date"
              />
            </div>

            {/* Reset Filter Button */}
            {hasFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
