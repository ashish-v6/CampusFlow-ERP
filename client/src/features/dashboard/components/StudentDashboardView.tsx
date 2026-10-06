import React from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Building2,
  Users,
  CalendarCheck,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { StudentDashboardData } from "../types/dashboard.types";
import AttendanceOverviewCard from "./AttendanceOverviewCard";
import { formatDisplayDate, getAttendanceStatusStyles } from "../../attendance/utils/attendanceBadgeStyles";

interface StudentDashboardViewProps {
  data: StudentDashboardData;
}

export default function StudentDashboardView({
  data,
}: StudentDashboardViewProps): React.JSX.Element {
  const { studentInfo, attendanceStats, recentAttendance, peersCount } = data;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* 1. Student Profile Quick Access Banner */}
      <div className="bg-card border border-primary/20 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-card to-card">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {studentInfo.name}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
                {studentInfo.studentId}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{studentInfo.program.name}</span>
              <span>•</span>
              <Building2 className="w-3.5 h-3.5" />
              <span>{studentInfo.department.name}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/students/me"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span>My Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/attendance"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-accent text-foreground text-xs font-semibold transition-all cursor-pointer"
          >
            <span>Attendance Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. 4 Academic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Classes */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Classes
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {attendanceStats.total}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Recorded academic sessions
            </span>
          </div>
        </div>

        {/* Present Sessions */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Present
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {attendanceStats.present}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Attended classes
            </span>
          </div>
        </div>

        {/* Program Peers */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Program Peers
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">{peersCount}</div>
            <span className="text-xs text-muted-foreground font-medium">
              Active in {studentInfo.program.code}
            </span>
          </div>
        </div>

        {/* Overall Attendance Rate */}
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
              {attendanceStats.percentage >= 75 ? "Good Standing" : "Requires Attention"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Attendance Overview Card */}
      <AttendanceOverviewCard
        stats={attendanceStats}
        title="My Attendance Breakdown"
        subtitle="Current status of your classroom participation and attendance."
      />

      {/* 4. Recent Class Attendance Sessions */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">
                Recent Class Attendance Log
              </h3>
              <p className="text-xs text-muted-foreground">
                Latest recorded session attendances
              </p>
            </div>
          </div>
          <Link
            to="/attendance"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentAttendance.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No attendance records logged for your profile yet.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {recentAttendance.map((rec) => {
              const statusStyle = getAttendanceStatusStyles(rec.status);
              return (
                <div
                  key={rec.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-foreground">
                      {formatDisplayDate(rec.date)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Marked by {rec.markedBy}{" "}
                      {rec.remarks ? `• ${rec.remarks}` : ""}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
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
  );
}
