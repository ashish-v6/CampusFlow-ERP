import React from "react";
import { GraduationCap, UserCheck, UserMinus, BookOpen } from "lucide-react";
import { StudentStats } from "../types/student.types";

interface StudentStatsCardsProps {
  stats: StudentStats;
}

/**
 * Metric summary cards displaying aggregate statistics for the Student module.
 * Matches visual hierarchy and layout established by UserStatsCards.
 */
export default function StudentStatsCards({ stats }: StudentStatsCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Students */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
          <GraduationCap className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
      </div>

      {/* 2. Active Students */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Students
          </span>
          <UserCheck className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.active}</div>
      </div>

      {/* 3. Inactive Students */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Inactive</span>
          <UserMinus className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.inActive}</div>
      </div>

      {/* 4. Academic Programs */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Programs</span>
          <BookOpen className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-3xl font-bold text-foreground">{stats.programs}</div>
      </div>
    </div>
  );
}
