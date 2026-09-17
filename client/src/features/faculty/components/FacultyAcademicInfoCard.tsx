import React from "react";
import { Building2, Hash, ShieldCheck } from "lucide-react";
import { Faculty } from "../types/faculty.types";

interface FacultyAcademicInfoCardProps {
  faculty: Faculty;
}

export default function FacultyAcademicInfoCard({
  faculty,
}: FacultyAcademicInfoCardProps): React.JSX.Element {
  const dept = faculty.department;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-indigo-500" />
        Department Assignment
      </h3>

      <div className="space-y-5 flex-1">
        {dept ? (
          <>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Department Name
              </div>
              <div className="text-sm font-medium text-foreground">
                {dept.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Dept Code
                </div>
                <div className="text-sm font-mono font-medium text-foreground bg-muted px-2 py-1 rounded inline-flex border border-border">
                  {dept.code}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Dept Status
                </div>
                <div className={`text-sm font-medium ${dept.status === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {dept.status}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/60 rounded-xl bg-muted/20">
            <Building2 className="w-8 h-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground">No Department Assigned</p>
            <p className="text-xs text-muted-foreground mt-1">
              This faculty member is not currently linked to an active department.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
