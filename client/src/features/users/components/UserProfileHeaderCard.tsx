import React from "react";
import { Mail, User as UserIcon, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { UserDetails } from "../users.types";
import { getRoleBadgeStyles, getStatusBadgeStyles } from "../utils/userBadgeStyles";

interface UserProfileHeaderCardProps {
  user: UserDetails;
}

export default function UserProfileHeaderCard({
  user,
}: UserProfileHeaderCardProps): React.JSX.Element {
  const statusStyles = getStatusBadgeStyles(user.status);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl sm:text-3xl font-bold shadow-md shrink-0">
        {user.initials}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${getRoleBadgeStyles(
                user.role
              )}`}
            >
              {user.role}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${statusStyles.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
              {user.status}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${
                user.isVerified
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}
            >
              {user.isVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Unverified
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            {user.email}
          </div>
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-4 h-4" />
            ID: <span className="font-mono text-foreground/80">{user.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Joined {new Date(user.createdAt).toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
