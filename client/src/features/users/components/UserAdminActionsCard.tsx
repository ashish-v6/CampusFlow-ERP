import React from "react";
import { Link } from "react-router";
import { Activity, UserX } from "lucide-react";

interface UserAdminActionsCardProps {
  userId: string;
}

export default function UserAdminActionsCard({
  userId,
}: UserAdminActionsCardProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Admin Actions</h3>
      </div>
      <div className="p-5 space-y-3">
        {/* PATCH /api/users/:id/status */}
        <Link
          to={`/users/${userId}/status`}
          className="w-full flex items-center gap-3 px-4 py-2.5 bg-accent/30 hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all text-left"
        >
          <Activity className="w-4 h-4 text-muted-foreground" />
          Change Status
        </Link>
        {/* DELETE /api/users/:id (Soft delete: updates status to INACTIVE) */}
        <Link
          to={`/users/${userId}/deactivate`}
          className="w-full flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-500 text-sm font-medium rounded-xl border border-transparent transition-all text-left"
        >
          <UserX className="w-4 h-4" />
          Deactivate User (Soft Delete)
        </Link>
      </div>
    </div>
  );
}
