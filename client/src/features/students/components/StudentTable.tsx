import React from "react";
import { Link } from "react-router";
import { Eye, GraduationCap } from "lucide-react";
import { Student } from "../types/student.types";
import { getStudentStatusStyles, getStudentInitials, formatDisplayDate } from "../utils/studentBadgeStyles";

interface StudentTableProps {
  students: Student[];
}

/**
 * Tabular view for students directory.
 * Visual design and structure directly reuse the conventions of UserTable.
 */
export default function StudentTable({ students }: StudentTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[850px]">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-5 py-3.5 font-medium">Student</th>
            <th className="px-5 py-3.5 font-medium">Student ID</th>
            <th className="px-5 py-3.5 font-medium">Email</th>
            <th className="px-5 py-3.5 font-medium">Program</th>
            <th className="px-5 py-3.5 font-medium">Phone</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {students.map((student) => {
            const statusStyle = getStudentStatusStyles(student.status);
            const initials = getStudentInitials(student.user?.firstName, student.user?.lastName);
            const fullName = `${student.user?.firstName || ""} ${student.user?.lastName || ""}`.trim() || "Unnamed Student";

            return (
              <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                {/* Student Name + Initials Avatar */}
                <td className="px-5 py-4">
                  <Link to={`/students/${student.id}`} className="flex items-center gap-3 group/student">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground group-hover/student:text-primary transition-colors">
                        {fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Admitted: {formatDisplayDate(student.admissionDate)}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Institutional Student ID */}
                <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold">
                  <Link
                    to={`/students/${student.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {student.studentId}
                  </Link>
                </td>

                {/* Email */}
                <td className="px-5 py-4 text-muted-foreground">
                  {student.user?.email || "Not provided"}
                </td>

                {/* Program name with code badge */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span className="font-medium text-foreground">
                      {student.program?.name || "Unassigned"}
                    </span>
                    {student.program?.code && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {student.program.code}
                      </span>
                    )}
                  </div>
                </td>

                {/* Phone */}
                <td className="px-5 py-4 text-muted-foreground">
                  {student.phone || "—"}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {student.status}
                  </span>
                </td>

                {/* Actions: View details */}
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/students/${student.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
