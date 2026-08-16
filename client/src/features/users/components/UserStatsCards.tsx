import React from "react";
import { Users as UsersIcon, UserCheck, UserX, UserMinus } from "lucide-react";
import { UserStats } from "../users.types";

interface UserStatsCardsProps {
  userDetails: UserStats;
}

export default function UserStatsCards({
  userDetails,
}: UserStatsCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
          <UsersIcon className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{userDetails.total}</div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Users
          </span>
          <UserCheck className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{userDetails.active}</div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-amber-600 dark:text-amber-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Suspended
          </span>
          <UserX className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{userDetails.suspended}</div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Inactive</span>
          <UserMinus className="w-4 h-4" />
        </div>
        <div className="text-3xl font-bold text-foreground">{userDetails.inActive}</div>
      </div>
    </div>
  );
}
