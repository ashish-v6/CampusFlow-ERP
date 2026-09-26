import React from "react";
import { Activity, BadgeCheck, Shield, Calendar, Phone, MapPin } from "lucide-react";
import { User } from "../profile.types";

interface AccountOverviewCardProps {
  user: User;
}

export default function AccountOverviewCard({ user }: AccountOverviewCardProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
        Account Overview
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm pb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Status</span>
          </div>
          <span className="font-medium text-foreground">{user.status}</span>
        </div>

        <div className="flex items-center justify-between text-sm pb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BadgeCheck className="w-4 h-4" />
            <span>Email</span>
          </div>
          <span
            className={`font-medium ${
              user.verified
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {user.verified ? "Verified" : "Unverified"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm pb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Role</span>
          </div>
          <span className="font-medium text-foreground capitalize">{user.role}</span>
        </div>

        {user.phone && (
          <div className="flex items-center justify-between text-sm pb-3 border-b border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </div>
            <span className="font-medium text-foreground">{user.phone}</span>
          </div>
        )}

        {user.address && (
          <div className="flex items-center justify-between text-sm pb-3 border-b border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Address</span>
            </div>
            <span className="font-medium text-foreground text-right max-w-[180px] truncate" title={user.address}>
              {user.address}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Member Since</span>
          </div>
          <span className="font-medium text-foreground">
            {new Date(user.createdAt).toDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
