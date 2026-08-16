import React from "react";
import { UserDetails } from "../users.types";
import { getStatusBadgeStyles } from "../utils/userBadgeStyles";

interface UserStatusSummaryCardProps {
  user: UserDetails;
}

export default function UserStatusSummaryCard({
  user,
}: UserStatusSummaryCardProps): React.JSX.Element {
  const statusStyles = getStatusBadgeStyles(user.status);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0">
        {user.initials}
      </div>
      <div className="flex-1 text-center sm:text-left space-y-2 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
              {user.role}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
              {user.status}
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span>{user.email}</span>
          <span className="hidden sm:inline text-border/80">•</span>
          <span className="font-mono text-xs opacity-70">ID: {user.id}</span>
        </div>
      </div>
    </div>
  );
}
