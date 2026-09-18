import React from "react";
import { Building2, CheckCircle2, XCircle } from "lucide-react";
import { DepartmentStats } from "../types/department.types";

interface DepartmentStatsCardsProps {
  stats: DepartmentStats;
}

/**
 * Metric summary cards displaying aggregate statistics for the Department module.
 * Matches visual hierarchy and tokens from FacultyStatsCards and StudentStatsCards.
 */
export default function DepartmentStatsCards({ stats }: DepartmentStatsCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. Total Departments */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Departments</span>
          <Building2 className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
      </div>

      {/* 2. Active Departments */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Departments
          </span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.active}</div>
      </div>

      {/* 3. Inactive Departments */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Inactive Departments</span>
          <XCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.inActive}</div>
      </div>
    </div>
  );
}
