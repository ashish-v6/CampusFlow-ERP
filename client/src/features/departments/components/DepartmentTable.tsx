import React from "react";
import { Link } from "react-router";
import { Eye, Building2 } from "lucide-react";
import { Department } from "../types/department.types";
import {
  getDepartmentStatusStyles,
  getDepartmentInitials,
} from "../utils/departmentBadgeStyles";

interface DepartmentTableProps {
  departments: Department[];
}

/**
 * Tabular view for department directory.
 * Visual design and structure directly reuse the conventions of FacultyTable and StudentTable.
 */
export default function DepartmentTable({ departments }: DepartmentTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-5 py-3.5 font-medium">Department Name</th>
            <th className="px-5 py-3.5 font-medium">Department Code</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {departments.map((dept) => {
            const statusStyle = getDepartmentStatusStyles(dept.status);
            const initials = getDepartmentInitials(dept.name);

            return (
              <tr key={dept.id} className="hover:bg-muted/30 transition-colors group">
                {/* Department Name + Initials Avatar */}
                <td className="px-5 py-4">
                  <Link to={`/departments/${dept.id}`} className="flex items-center gap-3 group/dept">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground group-hover/dept:text-primary transition-colors flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary/70 shrink-0" />
                        {dept.name}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Department Code */}
                <td className="px-5 py-4 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-muted text-foreground border border-border font-semibold font-mono">
                    {dept.code}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {dept.status}
                  </span>
                </td>

                {/* Actions: View details */}
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/departments/${dept.id}`}
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
