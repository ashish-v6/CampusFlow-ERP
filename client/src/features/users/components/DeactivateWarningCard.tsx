import React from "react";
import { ShieldAlert } from "lucide-react";

export default function DeactivateWarningCard(): React.JSX.Element {
  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-500 shrink-0 border border-amber-500/20">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Soft Delete Confirmation</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              This action will mark the user as{" "}
              <span className="font-semibold text-amber-600 dark:text-amber-500">INACTIVE</span>.
              The account record is retained and can be reactivated later by an administrator.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>The account status will become INACTIVE.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>
                Existing account information and historical records are fully preserved.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>The user can be reactivated later by an administrator.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
