import React from "react";
import { Link } from "react-router";
import { Edit3, Eye, Building2 } from "lucide-react";
import { AttendanceRecord } from "../types/attendance.types";
import {
  getAttendanceStatusStyles,
  formatDisplayDate,
  getInitials,
} from "../utils/attendanceBadgeStyles";

interface AttendanceTableProps {
  attendances: AttendanceRecord[];
  onEdit?: (record: AttendanceRecord) => void;
  canEdit?: boolean;
}

/**
 * Tabular view for attendance directory.
 * Visual design and structure directly reuse conventions of StudentTable, FacultyTable, and DepartmentTable.
 */
export default function AttendanceTable({
  attendances,
  onEdit,
  canEdit = true,
}: AttendanceTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[650px]">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-5 py-3.5 font-medium">Student</th>
            <th className="px-5 py-3.5 font-medium">Student ID</th>
            <th className="px-5 py-3.5 font-medium">Program</th>
            <th className="px-5 py-3.5 font-medium">Date</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {attendances.map((rec) => {
            const statusStyle = getAttendanceStatusStyles(rec.status);
            const studentUser = rec.student?.user;
            const initials = getInitials(studentUser?.firstName, studentUser?.lastName);
            const studentFullName =
              `${studentUser?.firstName || ""} ${studentUser?.lastName || ""}`.trim() ||
              "Student";

            return (
              <tr key={rec.id} className="hover:bg-muted/30 transition-colors group">
                {/* Student Name + Initials Avatar */}
                <td className="px-5 py-4">
                  <Link
                    to={`/attendance/student/${rec.studentId}`}
                    className="flex items-center gap-3 group/std"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div className="font-semibold text-foreground group-hover/std:text-primary transition-colors">
                      {studentFullName}
                    </div>
                  </Link>
                </td>

                {/* Institutional Student ID */}
                <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold">
                  <Link
                    to={`/attendance/student/${rec.studentId}`}
                    className="hover:text-primary transition-colors"
                  >
                    {rec.student?.studentId || "—"}
                  </Link>
                </td>

                {/* Program */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span className="font-medium text-foreground">
                      {rec.student?.program?.name || "Program"}
                    </span>
                    {rec.student?.program?.code && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {rec.student.program.code}
                      </span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-foreground font-medium whitespace-nowrap">
                  {formatDisplayDate(rec.date)}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {statusStyle.label}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {/* View Student History */}
                    <Link
                      to={`/attendance/student/${rec.studentId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                      title="View Student Attendance History"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      History
                    </Link>

                    {/* Edit Record */}
                    {canEdit && onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(rec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Attendance Record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
