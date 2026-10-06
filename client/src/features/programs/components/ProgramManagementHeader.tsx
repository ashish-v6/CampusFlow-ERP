import React, { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface ProgramManagementHeaderProps {
  onRefresh: () => Promise<void> | void;
  onAddProgram?: () => void;
  canCreate?: boolean;
}

/**
 * Header component for the Program directory.
 * Visual design matches DepartmentManagementHeader, FacultyManagementHeader, and StudentManagementHeader.
 */
export default function ProgramManagementHeader({
  onRefresh,
  onAddProgram,
  canCreate = true,
}: ProgramManagementHeaderProps): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Academic Programs
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Manage degree and certificate programs, curriculum codes, and departmental affiliations.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2.5 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl shadow-sm hover:border-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          aria-label="Refresh programs list"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>

        {canCreate && onAddProgram && (
          <button
            type="button"
            onClick={onAddProgram}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </button>
        )}
      </div>
    </div>
  );
}
