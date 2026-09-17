import React from "react";
import { Mail, Calendar, Hash, Building2 } from "lucide-react";
import { Faculty } from "../types/faculty.types";
import {
  getFacultyInitials,
  getFacultyStatusStyles,
  formatDisplayDate,
} from "../utils/facultyBadgeStyles";

interface FacultyProfileHeaderCardProps {
  faculty: Faculty;
}

/**
 * Top summary profile card for a faculty member displaying avatar, name,
 * faculty ID, email, department badge, and appointment status.
 * Replicates StudentProfileHeaderCard.tsx.
 */
export default function FacultyProfileHeaderCard({
  faculty,
}: FacultyProfileHeaderCardProps): React.JSX.Element {
  const statusStyles = getFacultyStatusStyles(faculty.status);
  const initials = getFacultyInitials(faculty.user?.firstName, faculty.user?.lastName);
  const fullName =
    `${faculty.user?.firstName || ""} ${faculty.user?.lastName || ""}`.trim() || "Faculty Member";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
      {/* Avatar Initials Circle */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl sm:text-3xl font-bold shadow-md shrink-0">
        {initials}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {fullName}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${statusStyles.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
              {faculty.status}
            </span>

            {/* Department Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
              <Building2 className="w-3 h-3" />
              {faculty.department?.name || "Department"}
            </span>
          </div>
        </div>

        {/* Metadata Details Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4" />
            Faculty ID:{" "}
            <span className="font-mono font-semibold text-foreground">
              {faculty.facultyId}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            <span>{faculty.user?.email || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDisplayDate(faculty.joiningDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
