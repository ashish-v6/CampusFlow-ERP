import React from "react";
import { Link } from "react-router";
import { ArrowLeft, Edit3 } from "lucide-react";

interface StudentDetailsHeaderProps {
  studentId: string;
  onEdit?: () => void;
  canEdit?: boolean;
  backUrl?: string;
  backText?: string;
}

/**
 * Header component for the Student Details page.
 * Includes back link and role-aware edit trigger.
 */
export default function StudentDetailsHeader({
  studentId,
  onEdit,
  canEdit = false,
  backUrl = "/students",
  backText = "Back to Students",
}: StudentDetailsHeaderProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Link
        to={backUrl}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        {backText}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Student Profile
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            View student personal data, enrollment records, and academic information.
          </p>
        </div>

        {canEdit && onEdit && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit Student
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
