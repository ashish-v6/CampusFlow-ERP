import React from "react";
import { Faculty } from "../types/faculty.types";

interface FacultyPersonalInfoCardProps {
  faculty: Faculty;
}

/**
 * Card displaying faculty personal identity and contact details.
 * Reuses dl/dt/dd layout and typography from StudentPersonalInfoCard and UserProfileInfoCard.
 */
export default function FacultyPersonalInfoCard({
  faculty,
}: FacultyPersonalInfoCardProps): React.JSX.Element {
  const fullName =
    `${faculty.user?.firstName || ""} ${faculty.user?.lastName || ""}`.trim() ||
    "Not provided";

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
      </div>
      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Full Name
            </dt>
            <dd className="text-sm font-medium text-foreground">{fullName}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Official Email
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {faculty.user?.email || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Phone Number
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {faculty.phone || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Account Role
            </dt>
            <dd className="text-sm font-medium text-foreground uppercase">
              {faculty.user?.role || "FACULTY"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
