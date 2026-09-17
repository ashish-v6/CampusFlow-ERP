import React from "react";
import { Briefcase } from "lucide-react";
import { Faculty } from "../types/faculty.types";
import { formatDisplayDate, getFacultyStatusStyles } from "../utils/facultyBadgeStyles";

interface FacultyInstitutionalInfoCardProps {
  faculty: Faculty;
}

/**
 * Card displaying institutional information:
 * Faculty ID, Department Name, Department Code, Designation, Joining Date, Employment Status.
 * Matches StudentAcademicInfoCard.tsx layout and design tokens.
 */
export default function FacultyInstitutionalInfoCard({
  faculty,
}: FacultyInstitutionalInfoCardProps): React.JSX.Element {
  const statusStyles = getFacultyStatusStyles(faculty.status);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Institutional Information</h3>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Faculty ID
            </dt>
            <dd className="text-sm font-mono font-medium text-foreground">
              {faculty.facultyId || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Department
            </dt>
            <dd className="text-sm font-semibold text-foreground">
              {faculty.department?.name || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Department Code
            </dt>
            <dd className="text-sm font-mono font-medium text-foreground">
              {faculty.department?.code || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Designation
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {faculty.designation || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Joining Date
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDisplayDate(faculty.joiningDate)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Employment Status
            </dt>
            <dd className="text-sm font-medium text-foreground flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${statusStyles.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                {faculty.status || "Not provided"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
