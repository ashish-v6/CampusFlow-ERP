import React, { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowLeft, 
  AlertTriangle, 
  UserX, 
  AlertCircle, 
  Info,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Check
} from "lucide-react";

// DELETE /api/users/:id
// Admin-only soft delete request. Updates target user's status to INACTIVE, retaining historical data.
export default function DeactivateUserPage(): React.JSX.Element {
  // Static visual UI states
  const showModal = false; // Toggle to view modal
  const isSuccess = false; // Toggle to view Success state
  const isError = false;   // Toggle to view Error state

  // Dummy UI state for checkbox (visual only)
  const [isConfirmed, setIsConfirmed] = useState(false);

  const dummyUser = {
    id: "USR-001",
    firstName: "Ashu",
    lastName: "Patel",
    email: "ashu@example.com",
    role: "STUDENT",
    status: "ACTIVE",
    initials: "AP"
  };

  // 7. SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">User Deactivated</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6 text-center max-w-sm">
          {dummyUser.firstName} {dummyUser.lastName}'s account has been marked as INACTIVE.
        </p>
        
        <div className="flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          INACTIVE
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link 
            to={`/users`}
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all text-center"
          >
            Back to Users
          </Link>
          <Link 
            to={`/users/${dummyUser.id}`}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 text-center"
          >
            Back to User
          </Link>
        </div>
      </div>
    );
  }

  // 8. ERROR STATE
  if (isError) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 mb-5 border border-red-500/20 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Unable to deactivate user</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 text-center max-w-sm leading-relaxed">
          The account could not be deactivated. Please try again or contact support if the issue persists.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link 
            to={`/users/${dummyUser.id}`}
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all text-center"
          >
            Back to User
          </Link>
          <button 
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 bg-accent hover:bg-accent/80 text-foreground text-sm font-semibold rounded-xl border border-border transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500 relative">
      
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <Link 
          to={`/users/${dummyUser.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to User
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Deactivate User
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            This action will mark the user as INACTIVE. The account record is retained and can be reactivated later.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. USER SUMMARY CARD */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0">
            {dummyUser.initials}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {dummyUser.firstName} {dummyUser.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  {dummyUser.role}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {dummyUser.status}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span>{dummyUser.email}</span>
              <span className="hidden sm:inline text-border/80">•</span>
              <span className="font-mono text-xs opacity-70">ID: {dummyUser.id}</span>
            </div>
          </div>
        </div>

        {/* 3. DEACTIVATION WARNING CARD */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-500 shrink-0 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Soft Delete Confirmation</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                  This action will mark the user as <span className="font-semibold text-foreground">INACTIVE</span>. The account record is retained and can be reactivated later by an administrator.
                </p>
              </div>
              
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>The account status will become INACTIVE.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Existing account information and historical records are fully preserved.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>The user can be reactivated later by an administrator.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. CONFIRMATION SECTION & 5. ACTION BUTTONS */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Deactivate this user?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Are you sure you want to deactivate {dummyUser.firstName} {dummyUser.lastName}'s account?
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-muted-foreground bg-accent/30 cursor-pointer transition-colors group">
              <div className="pt-0.5">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  isConfirmed 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-background border-input group-hover:border-primary/50"
                }`}>
                  {isConfirmed && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
              <span className="text-sm font-medium text-foreground leading-relaxed select-none">
                I understand that this account will become inactive.
              </span>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isConfirmed}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-card"
            >
              Deactivate User
            </button>
          </div>

        </div>
      </div>

      {/* 6. CONFIRMATION MODAL (Static Visual UI Only) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-500 mb-4 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Deactivate {dummyUser.firstName} {dummyUser.lastName}?</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This will mark the account as <strong className="text-foreground">INACTIVE</strong>. The account can be reactivated later by an administrator.
              </p>
            </div>
            <div className="p-4 bg-accent/30 border-t border-border flex justify-end gap-3">
              <button 
                type="button"
                className="px-4 py-2 text-sm font-medium text-foreground bg-transparent hover:bg-accent rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
