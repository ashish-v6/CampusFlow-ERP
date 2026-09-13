import React from "react";
import { Student } from "../types/student.types";
import { formatDisplayDate } from "../utils/studentBadgeStyles";

interface StudentPersonalInfoCardProps {
  student: Student;
}

/**
 * Card displaying student personal identity and contact details.
 * Reuses dl/dt/dd layout and typography from UserProfileInfoCard.
 */
export default function StudentPersonalInfoCard({
  student,
}: StudentPersonalInfoCardProps): React.JSX.Element {
  const fullName =
    `${student.user?.firstName || ""} ${student.user?.lastName || ""}`.trim() ||
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
              {student.user?.email || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Phone Number
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {student.phone || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Gender
            </dt>
            <dd className="text-sm font-medium text-foreground capitalize">
              {student.gender ? student.gender.toLowerCase() : "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Date of Birth
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDisplayDate(student.dateOfBirth)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Residential Address
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {student.address || "Not provided"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
