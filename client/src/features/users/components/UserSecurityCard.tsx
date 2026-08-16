import React from "react";
import { CheckCircle2, XCircle, Shield } from "lucide-react";
import { UserDetails } from "../users.types";

interface UserSecurityCardProps {
  user: UserDetails;
}

export default function UserSecurityCard({
  user,
}: UserSecurityCardProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Security & Verification</h3>
      </div>
      <div className="p-5 sm:p-6 space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-border/50">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              user.isVerified
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {user.isVerified ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Email Verification</h4>
            <p
              className={`text-sm font-medium mt-0.5 ${
                user.isVerified
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.isVerified
                ? "Email address has been verified."
                : "Email address has not been verified yet."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Account Security</h4>
            <p className="text-sm text-foreground font-medium mt-0.5">Protected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Account credentials are securely stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
