import React from "react";
import { Link } from "react-router";
import { BookOpen, Edit3, Building2, Users, Eye } from "lucide-react";
import { Program } from "../types/program.types";
import {
  getProgramStatusStyles,
  getProgramInitials,
} from "../utils/programBadgeStyles";

interface ProgramTableProps {
  programs: Program[];
  onEditProgram?: (program: Program) => void;
  onViewStudents?: (program: Program) => void;
  canEdit?: boolean;
}

/**
 * Tabular view for the Academic Programs directory.
 * Visual design and structure directly reuse the conventions of DepartmentTable and StudentTable.
 */
export default function ProgramTable({
  programs,
  onEditProgram,
  onViewStudents,
  canEdit = true,
}: ProgramTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[750px]">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="px-5 py-3.5 font-medium">Program Name</th>
            <th className="px-5 py-3.5 font-medium">Code</th>
            <th className="px-5 py-3.5 font-medium">Department</th>
            <th className="px-5 py-3.5 font-medium">Students</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {programs.map((prog) => {
            const statusStyle = getProgramStatusStyles(prog.status);
            const initials = getProgramInitials(prog.name);
            const studentCount = prog._count?.students ?? 0;

            return (
              <tr key={prog.id} className="hover:bg-muted/30 transition-colors group">
                {/* Program Name + Initials Avatar */}
                <td className="px-5 py-4">
                  <Link
                    to={`/programs/${prog.id}`}
                    className="flex items-center gap-3 group/prog"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground group-hover/prog:text-primary transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary/70 shrink-0" />
                        {prog.name}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Program Code */}
                <td className="px-5 py-4 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-muted text-foreground border border-border font-semibold font-mono">
                    {prog.code}
                  </span>
                </td>

                {/* Department Info */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{prog.department?.name || "Unassigned"}</span>
                    {prog.department?.code && (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({prog.department.code})
                      </span>
                    )}
                  </div>
                </td>

                {/* Students Count (Clickable to view students) */}
                <td className="px-5 py-4">
                  {onViewStudents ? (
                    <button
                      type="button"
                      onClick={() => onViewStudents(prog)}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-accent/60 hover:bg-accent border border-border text-foreground hover:text-primary transition-colors cursor-pointer"
                      title="View enrolled students"
                    >
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold">{studentCount}</span>
                      <span>students</span>
                    </button>
                  ) : (
                    <Link
                      to={`/programs/${prog.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{studentCount} students</span>
                    </Link>
                  )}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {prog.status}
                  </span>
                </td>

                {/* Actions: View Details & Edit */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/programs/${prog.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                      title="View program details & enrolled students"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    {canEdit && onEditProgram && (
                      <button
                        type="button"
                        onClick={() => onEditProgram(prog)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit program"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
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
