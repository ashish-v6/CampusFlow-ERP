import React from "react";
import { Link } from "react-router";
import { GraduationCap, Briefcase, Building2, ArrowRight } from "lucide-react";
import {
  RecentStudent,
  RecentFaculty,
  RecentDepartment,
} from "../types/dashboard.types";

interface RecentActivityCardProps {
  students?: RecentStudent[];
  faculty?: RecentFaculty[];
  departments?: RecentDepartment[];
}

export default function RecentActivityCard({
  students = [],
  faculty = [],
  departments = [],
}: RecentActivityCardProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Recent Students */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Recent Students</h3>
            </div>
            <Link
              to="/students"
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {students.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No recent student registrations.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {student.program} • {student.studentId}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      student.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Recent Faculty */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Recent Faculty</h3>
            </div>
            <Link
              to="/faculty"
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {faculty.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No recent faculty appointments.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {faculty.map((f) => (
                <div
                  key={f.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">
                      {f.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {f.department} • {f.designation}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      f.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Recent Departments */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Recent Departments</h3>
            </div>
            <Link
              to="/departments"
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {departments.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No departments created yet.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {departments.map((d) => (
                <div
                  key={d.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-semibold">
                      {d.code}
                    </span>
                    <span className="font-semibold text-foreground truncate">
                      {d.name}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      d.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
