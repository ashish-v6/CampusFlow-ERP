import React from "react";
import { Plus, RefreshCw } from "lucide-react";

interface UserManagementHeaderProps {
  onRefresh: () => Promise<void> | void;
}

export default function UserManagementHeader({
  onRefresh,
}: UserManagementHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Manage and monitor CampusFlow user accounts.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2.5 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl shadow-sm hover:border-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Refresh user list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        {/* UI placeholder button - User creation is handled via Auth signup / backend onboarding */}
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>
    </div>
  );
}
