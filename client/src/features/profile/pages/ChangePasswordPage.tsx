import React from "react";
import { Link } from "react-router";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Circle,
  Info
} from "lucide-react";

// PATCH /api/users/change-password
// Dedicated page allowing authenticated users to update their password.
export default function ChangePasswordPage(): React.JSX.Element {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Profile
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Change Password
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[560px] mx-auto space-y-6">
        
        {/* Optional Success State (Visual Only) */}
        {/* Uncomment to view success state:
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Check className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Password updated successfully</p>
        </div>
        */}

        {/* 2. SECURITY CARD */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header Area */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Update your password</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Choose a strong password that you don't use elsewhere.
                </p>
              </div>
            </div>

            {/* 3. PASSWORD FORM */}
            <div className="space-y-5">
              
              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="currentPassword"
                    defaultValue="dummy-password"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-border/80 transition-all placeholder:text-muted-foreground shadow-xs"
                    placeholder="Enter current password"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2 pt-2">
                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="newPassword"
                    defaultValue="NewP@ssw0rd!"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-border/80 transition-all placeholder:text-muted-foreground shadow-xs"
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist (Visual Only) */}
              <div className="bg-accent/30 rounded-xl p-4 space-y-2.5 border border-border/50">
                <h4 className="text-xs font-semibold text-foreground">Password requirements:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>One uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>One lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>One number</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Circle className="w-3 h-3 ml-[1px] mr-[1px] text-muted-foreground/50" />
                    <span>One special character</span>
                  </li>
                </ul>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2 pt-2">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    defaultValue="NewP@ssw0rd!"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-border/80 transition-all placeholder:text-muted-foreground shadow-xs"
                    placeholder="Confirm new password"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 4. ACTIONS */}
          <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
            >
              Update Password
            </button>
          </div>

        </div>

        {/* 5. SECURITY INFORMATION */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-border">
          <div className="mt-0.5 text-primary">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Security tip</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Never share your password with anyone. Use a unique, strong password specifically for your CampusFlow account to keep your data secure.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
