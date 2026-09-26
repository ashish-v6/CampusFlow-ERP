import React from "react";
import { BookOpen, Edit3, Building2, Users } from "lucide-react";
import { Program } from "../types/program.types";
import {
  getProgramStatusStyles,
  getProgramInitials,
} from "../utils/programBadgeStyles";

interface ProgramTableProps {
  programs: Program[];
  onEditProgram?: (program: Program) => void;
  canEdit?: boolean;
}

/**
 * Tabular view for the Academic Programs directory.
 * Visual design and structure directly reuse the conventions of DepartmentTable and StudentTable.
 */
export default function ProgramTable({
  programs,
  onEditProgram,
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
            {canEdit && <th className="px-5 py-3.5 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-sm">
          {programs.map((prog) => {
            const statusStyle = getProgramStatusStyles(prog.status);
            const initials = getProgramInitials(prog.name);

            return (
              <tr key={prog.id} className="hover:bg-muted/30 transition-colors group">
                {/* Program Name + Initials Avatar */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary/70 shrink-0" />
                        {prog.name}
                      </div>
                    </div>
                  </div>
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

                {/* Students Count */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{prog._count?.students ?? 0} students</span>
                  </div>
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

                {/* Actions: Edit */}
                {canEdit && (
                  <td className="px-5 py-4 text-right">
                    {onEditProgram && (
                      <button
                        type="button"
                        onClick={() => onEditProgram(prog)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit program"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
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
