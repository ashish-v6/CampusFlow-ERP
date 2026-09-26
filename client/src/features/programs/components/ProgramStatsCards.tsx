import React from "react";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { ProgramStats } from "../types/program.types";

interface ProgramStatsCardsProps {
  stats: ProgramStats;
}

/**
 * Metric summary cards displaying aggregate statistics for the Program module.
 * Matches visual hierarchy and tokens from DepartmentStatsCards and FacultyStatsCards.
 */
export default function ProgramStatsCards({ stats }: ProgramStatsCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. Total Programs */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Programs</span>
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
      </div>

      {/* 2. Active Programs */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Programs
          </span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.active}</div>
      </div>

      {/* 3. Inactive Programs */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Inactive Programs</span>
          <XCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.inactive}</div>
      </div>
    </div>
  );
}
