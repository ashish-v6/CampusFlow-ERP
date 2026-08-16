import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface UserDetailsHeaderProps {
  userId: string;
}

export default function UserDetailsHeader({
  userId,
}: UserDetailsHeaderProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Link
        to="/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Users
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            User Details
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            View account and profile information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/users/${userId}/status`}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-accent hover:bg-accent/80 text-foreground text-sm font-semibold rounded-xl border border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Change Status
          </Link>
        </div>
      </div>
    </div>
  );
}
