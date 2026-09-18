import React from "react";
import { Building2 } from "lucide-react";
import { Department } from "../types/department.types";
import { getDepartmentStatusStyles } from "../utils/departmentBadgeStyles";

interface DepartmentInfoCardProps {
  department: Department;
}

/**
 * Card displaying institutional information for a department:
 * Department Name, Department Code, Operational Status, and Unique Identifier.
 * Matches FacultyInstitutionalInfoCard.tsx layout and tokens.
 */
export default function DepartmentInfoCard({
  department,
}: DepartmentInfoCardProps): React.JSX.Element {
  const statusStyles = getDepartmentStatusStyles(department.status);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Department Information</h3>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Department Name
            </dt>
            <dd className="text-sm font-semibold text-foreground">
              {department.name || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Department Code
            </dt>
            <dd className="text-sm font-mono font-medium text-foreground">
              {department.code || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Operational Status
            </dt>
            <dd className="text-sm font-medium text-foreground flex flex-col items-start gap-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${statusStyles.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                {department.status || "Not provided"}
              </span>
              <span className="text-xs text-muted-foreground">
                {statusStyles.description}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Department ID
            </dt>
            <dd className="text-sm font-mono text-muted-foreground break-all">
              {department.id}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
