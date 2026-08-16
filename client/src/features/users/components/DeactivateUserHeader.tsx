import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface DeactivateUserHeaderProps {
  userId: string;
}

export default function DeactivateUserHeader({
  userId,
}: DeactivateUserHeaderProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Link
        to={`/users/${userId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to User
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Deactivate User
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          This action will mark the user as INACTIVE. The account record is retained and can be
          reactivated later.
        </p>
      </div>
    </div>
  );
}
