import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function UpdateUserStatusHeader(): React.JSX.Element {
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

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Update User Status
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Change this user's account status.
        </p>
      </div>
    </div>
  );
}
