import React from "react";
import { Link } from "react-router";
import { Eye, Building2 } from "lucide-react";
import { Faculty } from "../types/faculty.types";
import {
  getFacultyStatusStyles,
  getFacultyInitials,
  formatDisplayDate,
} from "../utils/facultyBadgeStyles";

interface FacultyTableProps {
  faculties: Faculty[];
}

/**
 * Tabular view for faculty directory.
 * Visual design and structure directly reuse the conventions of StudentTable and UserTable.
 */
export default function FacultyTable({ faculties }: FacultyTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[850px]">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-5 py-3.5 font-medium">Faculty</th>
            <th className="px-5 py-3.5 font-medium">Faculty ID</th>
            <th className="px-5 py-3.5 font-medium">Email</th>
            <th className="px-5 py-3.5 font-medium">Department</th>
            <th className="px-5 py-3.5 font-medium">Designation</th>
            <th className="px-5 py-3.5 font-medium">Phone</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {faculties.map((faculty) => {
            const statusStyle = getFacultyStatusStyles(faculty.status);
            const initials = getFacultyInitials(faculty.user?.firstName, faculty.user?.lastName);
            const fullName =
              `${faculty.user?.firstName || ""} ${faculty.user?.lastName || ""}`.trim() ||
              "Faculty Member";

            return (
              <tr key={faculty.id} className="hover:bg-muted/30 transition-colors group">
                {/* Faculty Name + Initials Avatar */}
                <td className="px-5 py-4">
                  <Link to={`/faculty/${faculty.id}`} className="flex items-center gap-3 group/faculty">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground group-hover/faculty:text-primary transition-colors">
                        {fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Joined: {formatDisplayDate(faculty.joiningDate)}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Institutional Faculty ID */}
                <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold">
                  <Link
                    to={`/faculty/${faculty.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {faculty.facultyId}
                  </Link>
                </td>

                {/* Email */}
                <td className="px-5 py-4 text-muted-foreground">
                  {faculty.user?.email || "Not provided"}
                </td>

                {/* Department with code badge */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span className="font-medium text-foreground">
                      {faculty.department?.name || "Unassigned"}
                    </span>
                    {faculty.department?.code && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {faculty.department.code}
                      </span>
                    )}
                  </div>
                </td>

                {/* Designation */}
                <td className="px-5 py-4 text-foreground font-medium">
                  {faculty.designation}
                </td>

                {/* Phone */}
                <td className="px-5 py-4 text-muted-foreground">
                  {faculty.phone || "—"}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {faculty.status}
                  </span>
                </td>

                {/* Actions: View details */}
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/faculty/${faculty.id}`}
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
