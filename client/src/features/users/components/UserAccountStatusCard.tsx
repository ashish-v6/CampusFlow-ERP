import React from "react";
import { Link } from "react-router";
import { UserDetails } from "../users.types";
import { getStatusBadgeStyles } from "../utils/userBadgeStyles";

interface UserAccountStatusCardProps {
  user: UserDetails;
}

export default function UserAccountStatusCard({
  user,
}: UserAccountStatusCardProps): React.JSX.Element {
  const statusStyles = getStatusBadgeStyles(user.status);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Account Status</h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusStyles.pingDot}`}
            />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${statusStyles.dot}`} />
          </div>
          <span className={`font-semibold ${statusStyles.text}`}>{user.status}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{statusStyles.description}</p>
        <Link
          to={`/users/${user.id}/status`}
          className="block text-center w-full mt-2 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-sm font-medium rounded-xl border border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Change Status
        </Link>
      </div>
    </div>
  );
}
