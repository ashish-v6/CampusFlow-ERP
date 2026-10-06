import React from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Briefcase,
  Building2,
  CalendarCheck,
  ArrowRight,
  User,
} from "lucide-react";
import { FacultyDashboardData } from "../types/dashboard.types";
import AttendanceOverviewCard from "./AttendanceOverviewCard";
import { formatDisplayDate, getAttendanceStatusStyles } from "../../attendance/utils/attendanceBadgeStyles";

interface FacultyDashboardViewProps {
  data: FacultyDashboardData;
}

export default function FacultyDashboardView({
  data,
}: FacultyDashboardViewProps): React.JSX.Element {
  const { facultyInfo, departmentStats, attendanceStats, recent } = data;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* 1. Department Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Dept Students */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Department Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {departmentStats.students.total}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {departmentStats.students.active} active in {facultyInfo.department.code}
            </span>
          </div>
        </div>

        {/* Dept Faculty */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Department Faculty
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {departmentStats.faculty.total}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {departmentStats.faculty.active} active colleagues
            </span>
          </div>
        </div>

        {/* Total Campus Departments */}
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
              {departmentStats.totalDepartments}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Academic divisions
            </span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Attendance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {attendanceStats.percentage}%
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {attendanceStats.present} of {attendanceStats.total} sessions present
            </span>
          </div>
        </div>
      </div>

      {/* 2. Attendance Overview */}
      <AttendanceOverviewCard
        stats={attendanceStats}
        title={`${facultyInfo.department.name} Attendance Overview`}
        subtitle="Aggregated student attendance records for your academic department."
      />

      {/* 3. Recent Activity Grid (Department Students + My Marked Sessions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Students */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  Department Students
                </h3>
              </div>
              <Link
                to="/students"
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <span>Student Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recent.students.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No students enrolled in this department yet.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recent.students.map((student) => (
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

        {/* Recently Marked Attendance Sessions */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  My Recent Marked Attendance
                </h3>
              </div>
              <Link
                to="/attendance"
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <span>Mark Attendance</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recent.recentAttendance.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No attendance sessions recorded by you yet.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recent.recentAttendance.map((rec) => {
                  const statusStyle = getAttendanceStatusStyles(rec.status);
                  return (
                    <div
                      key={rec.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground truncate">
                          {rec.studentName}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {formatDisplayDate(rec.date)} {rec.remarks ? `• ${rec.remarks}` : ""}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyle.badge}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
