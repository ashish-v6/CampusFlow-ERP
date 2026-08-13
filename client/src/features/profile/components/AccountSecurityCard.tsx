import React from "react";
import { Lock, ShieldCheck } from "lucide-react";

export default function AccountSecurityCard(): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Account Security</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your password and security preferences.
          </p>
        </div>
      </div>
      
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background/50">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/50 text-foreground shrink-0 mt-0.5 sm:mt-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Password</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your password is securely protected.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-sm font-medium rounded-xl border border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
