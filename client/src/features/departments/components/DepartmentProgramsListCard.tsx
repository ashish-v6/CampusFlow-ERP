import React from "react";
import { Link } from "react-router";
import { BookOpen, Users, Plus, ArrowUpRight } from "lucide-react";
import { Department } from "../types/department.types";
import { getDepartmentStatusStyles, getDepartmentInitials } from "../utils/departmentBadgeStyles";

interface DepartmentProgramsListCardProps {
  department: Department;
  onAddProgram?: () => void;
  canAddProgram?: boolean;
}

export default function DepartmentProgramsListCard({
  department,
  onAddProgram,
  canAddProgram = false,
}: DepartmentProgramsListCardProps): React.JSX.Element {
  const programs = department.programs || [];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              Academic Programs
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {programs.length}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Degrees and certificates administered by {department.name}.
            </p>
          </div>
        </div>

        {canAddProgram && onAddProgram && (
          <button
            type="button"
            onClick={onAddProgram}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors cursor-pointer self-start sm:self-auto border border-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Program
          </button>
        )}
      </div>

      {/* Programs List Table or Empty State */}
      {programs.length === 0 ? (
        <div className="p-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">No Academic Programs</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            This department does not have any registered academic degree programs yet.
          </p>
          {canAddProgram && onAddProgram && (
            <button
              type="button"
              onClick={onAddProgram}
              className="mt-4 px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Add First Program
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Program Name</th>
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Enrolled Students</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {programs.map((prog) => {
                const statusStyle = getDepartmentStatusStyles(prog.status);
                const initials = getDepartmentInitials(prog.name);
                const studentCount = prog._count?.students ?? 0;

                return (
                  <tr key={prog.id} className="hover:bg-muted/30 transition-colors group">
                    {/* Program Name */}
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/programs/${prog.id}`}
                        className="flex items-center gap-3 group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                          {initials}
                        </div>
                        <div className="font-semibold text-foreground group-hover/item:text-primary transition-colors text-sm">
                          {prog.name}
                        </div>
                      </Link>
                    </td>

                    {/* Program Code */}
                    <td className="px-5 py-3.5 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-semibold font-mono">
                        {prog.code}
                      </span>
                    </td>

                    {/* Students Count */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-medium text-foreground">{studentCount}</span>
                        <span>students</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {prog.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/programs/${prog.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
