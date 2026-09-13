import React from "react";
import { GraduationCap } from "lucide-react";
import { Student } from "../types/student.types";
import { formatDisplayDate, getStudentStatusStyles } from "../utils/studentBadgeStyles";

interface StudentAcademicInfoCardProps {
  student: Student;
}

/**
 * Card displaying academic information:
 * Student ID, Program Name, Program Code, Admission Date, Status.
 * Displays clean placeholders and never exposes raw database UUIDs.
 */
export default function StudentAcademicInfoCard({
  student,
}: StudentAcademicInfoCardProps): React.JSX.Element {
  const statusStyles = getStudentStatusStyles(student.status);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Academic Information</h3>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Student ID
            </dt>
            <dd className="text-sm font-mono font-medium text-foreground">
              {student.studentId || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Enrolled Program
            </dt>
            <dd className="text-sm font-semibold text-foreground">
              {student.program?.name || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Program Code
            </dt>
            <dd className="text-sm font-mono font-medium text-foreground">
              {student.program?.code || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Admission Date
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDisplayDate(student.admissionDate)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Enrollment Status
            </dt>
            <dd className="text-sm font-medium text-foreground flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${statusStyles.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                {student.status || "Not provided"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
