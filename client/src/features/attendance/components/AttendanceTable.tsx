import React from "react";
import { CheckCircle2, XCircle, Clock, Eye, Pencil } from "lucide-react";
import { AttendanceRecord } from "../types/attendance.types";
import {
  formatAttendanceDisplayDate,
  formatDisplayDateTime,
} from "../utils/attendanceDate.utils";
import {
  getAttendanceStatusStyles,
  getStudentInitials,
} from "../utils/attendanceBadgeStyles";

interface AttendanceTableProps {
  attendances: AttendanceRecord[];
  onView?: (record: AttendanceRecord) => void;
  onEdit?: (record: AttendanceRecord) => void;
  canEdit?: boolean;
}

/**
 * Tabular view for attendance records.
 * Follows StudentTable & UserTable visual hierarchy, tokens, and actions.
 */
export default function AttendanceTable({
  attendances,
  onView,
  onEdit,
  canEdit = false,
}: AttendanceTableProps): React.JSX.Element {
  const showActions = Boolean(onView || onEdit);

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-5 py-3.5 font-medium">Student</th>
            <th className="px-5 py-3.5 font-medium">Attendance Date</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium">Recorded At</th>
            {showActions && (
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {attendances.map((record) => {
            const statusStyle = getAttendanceStatusStyles(record.status);
            const user = record.student?.user;
            const initials = getStudentInitials(user?.firstName, user?.lastName);
            const fullName =
              `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
              "Enrolled Student";

            return (
              <tr
                key={record.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Student Info */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {fullName}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {user?.email && <span>{user.email}</span>}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Attendance Calendar Date */}
                <td className="px-5 py-4">
                  <div className="font-semibold text-foreground text-sm">
                    {formatAttendanceDisplayDate(record.date)}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    Calendar Date
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
                  >
                    {record.status === "PRESENT" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{statusStyle.label}</span>
                  </span>
                </td>

                {/* Recorded At */}
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    <span>{formatDisplayDateTime(record.createdAt)}</span>
                  </div>
                </td>

                {/* Actions Column (View / Edit) */}
                {showActions && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(record)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {canEdit && onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Correct Attendance"
                          aria-label="Correct Attendance"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
