import React from "react";
import { Mail, User as UserIcon, CheckCircle2, Activity } from "lucide-react";
import { User } from "../profile.types";

interface ProfileSummaryCardProps {
  user: User;
}

export default function ProfileSummaryCard({ user }: ProfileSummaryCardProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
      {/* Avatar (Initials Display) */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-3xl sm:text-4xl font-bold shadow-md">
        {user.initials}
      </div>

      {/* User Info */}
      <div className="space-y-1 w-full">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          {user.email}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider uppercase">
          <UserIcon className="w-3 h-3" />
          {user.role}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
          <CheckCircle2 className="w-3 h-3" />
          {user.verified ? "Verified" : "Unverified"}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
          <Activity className="w-3 h-3" />
          {user.status}
        </span>
      </div>
    </div>
  );
}
