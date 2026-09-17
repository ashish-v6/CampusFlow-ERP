import React from "react";
import { Briefcase, UserCheck, UserMinus, Building2 } from "lucide-react";
import { FacultyStats } from "../types/faculty.types";

interface FacultyStatsCardsProps {
  stats: FacultyStats;
}

/**
 * Metric summary cards displaying aggregate statistics for the Faculty module.
 * Matches visual hierarchy and tokens from StudentStatsCards and UserStatsCards.
 */
export default function FacultyStatsCards({ stats }: FacultyStatsCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Faculty */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Faculty</span>
          <Briefcase className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
      </div>

      {/* 2. Active Faculty */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Faculty
          </span>
          <UserCheck className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.active}</div>
      </div>

      {/* 3. Inactive Faculty */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Inactive</span>
          <UserMinus className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.inActive}</div>
      </div>

      {/* 4. Departments */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Departments</span>
          <Building2 className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.departments}</div>
      </div>
    </div>
  );
}
