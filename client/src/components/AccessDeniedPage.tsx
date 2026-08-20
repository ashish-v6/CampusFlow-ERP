// Shown when the user is authenticated but their role is not allowed.
// ProtectedRoute redirects unauthorized users to /403.

import React from "react";
import { ShieldAlert, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router";

export interface AccessDeniedPageProps {
  /** Optional callback triggered when clicking "Go Back" */
  onGoBack?: () => void;
  /** Custom heading text if needed (defaults to "Access Denied") */
  title?: string;
  /** Custom description text (defaults to standard 403 text) */
  description?: string;
  /** Custom secondary explanation text */
  secondaryDescription?: string;
  /** Status badge label (defaults to "403 • Forbidden") */
  badgeText?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  onGoBack,
  title = "Access Denied",
  description = "You don't have permission to access this page.",
  secondaryDescription = "Your current account role does not allow access to this resource.",
  badgeText = "403 • Forbidden",
}) => {
  const navigate = useNavigate();
  const onGoToDashboard = () => {
    navigate("/dashboard", { replace: true });
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background text-foreground font-sans relative select-none">
      {/* Background Subtle Ambient Blur */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Container Card */}
      <div className="w-full max-w-md mx-auto text-center z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/5 dark:shadow-black/20 flex flex-col items-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{badgeText}</span>
          </div>

          {/* Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            {title}
          </h1>

          {/* Primary Supporting Text */}
          <p className="text-sm sm:text-base text-muted-foreground font-medium mb-1.5 max-w-sm">
            {description}
          </p>

          {/* Optional Secondary Text */}
          <p className="text-xs sm:text-sm text-muted-foreground/80 mb-8 max-w-xs">
            {secondaryDescription}
          </p>

          {/* UI Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={onGoToDashboard}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={onGoBack}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-muted-foreground bg-accent/60 hover:bg-accent hover:text-foreground border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
