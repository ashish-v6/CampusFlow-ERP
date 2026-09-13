import React from "react";
import { Mail, Calendar, Hash, GraduationCap } from "lucide-react";
import { Student } from "../types/student.types";
import { getStudentInitials, getStudentStatusStyles, formatDisplayDate } from "../utils/studentBadgeStyles";

interface StudentProfileHeaderCardProps {
  student: Student;
}

/**
 * Top summary profile card for a student displaying avatar, name,
 * student ID, email, program badge, and enrollment status.
 */
export default function StudentProfileHeaderCard({
  student,
}: StudentProfileHeaderCardProps): React.JSX.Element {
  const statusStyles = getStudentStatusStyles(student.status);
  const initials = getStudentInitials(student.user?.firstName, student.user?.lastName);
  const fullName = `${student.user?.firstName || ""} ${student.user?.lastName || ""}`.trim() || "Student";

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
              {student.status}
            </span>

            {/* Program Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
              <GraduationCap className="w-3 h-3" />
              {student.program?.name || "Program"}
            </span>
          </div>
        </div>

        {/* Metadata Details Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4" />
            Student ID:{" "}
            <span className="font-mono font-semibold text-foreground">
              {student.studentId}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            <span>{student.user?.email || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Admitted {formatDisplayDate(student.admissionDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
