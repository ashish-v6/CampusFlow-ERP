// Shown while AuthContext is verifying the user's existing session.
// ProtectedRoute renders this UI while isVerifying is true.

import React from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";

export interface AuthLoadingProps {
  /** Main message text during session verification (defaults to "Checking your session...") */
  title?: string;
  /** Secondary message providing context (defaults to session verification prompt) */
  supportingText?: string;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({
  title = "Checking your session...",
  supportingText = "Please wait while we securely verify your account.",
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background text-foreground font-sans relative select-none">
      {/* Background Subtle Ambient Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/15 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Centered Content */}
      <div className="w-full max-w-sm mx-auto text-center z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* CampusFlow Brand Logo & Wordmark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-md shadow-primary/20 border border-primary/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5 text-left">
            <span className="font-bold text-2xl tracking-tight text-foreground">CampusFlow</span>
            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              ERP
            </span>
          </div>
        </div>

        {/* Polished Card Container */}
        <div className="w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/5 dark:shadow-black/20 flex flex-col items-center">
          
          {/* Subtle Spinner & Security Indicator */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Outer Ring Spinner */}
            <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />

            {/* Inner Security Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          {/* Main Verification Text */}
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
            {title}
          </h2>

          {/* Supporting Verification Message */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
            {supportingText}
          </p>

          {/* Security Status Indicator */}
          <div className="mt-6 pt-4 border-t border-border/60 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure Verification Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoading;
