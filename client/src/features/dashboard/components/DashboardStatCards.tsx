import React from "react";
import { GraduationCap, Briefcase, Building2, Users } from "lucide-react";
import { SystemStats } from "../types/dashboard.types";

interface DashboardStatCardsProps {
  stats: SystemStats;
}

/**
 * Metric summary cards showing Total Students, Total Faculty, Total Departments, and Total Users.
 * Matches FacultyStatsCards, StudentStatsCards, and DepartmentStatsCards.
 */
export default function DashboardStatCards({
  stats,
}: DashboardStatCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Students */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Students
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">
            {stats.students.total}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {stats.students.active} active enrolled
          </span>
        </div>
      </div>

      {/* 2. Total Faculty */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Faculty
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">
            {stats.faculty.total}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {stats.faculty.active} active appointed
          </span>
        </div>
      </div>

      {/* 3. Total Departments */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Departments
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">
            {stats.departments.total}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {stats.departments.active} active departments
          </span>
        </div>
      </div>

      {/* 4. Total Users */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Users
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">
            {stats.users.total}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {stats.users.active} active ({stats.users.suspended} suspended)
          </span>
        </div>
      </div>
    </div>
  );
}
