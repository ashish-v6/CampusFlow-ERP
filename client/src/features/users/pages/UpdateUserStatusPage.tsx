import React, { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  UserX, 
  AlertCircle, 
  Info,
  Check
} from "lucide-react";

// PATCH /api/users/:id/status
// Admin-only UI for changing the target user's account status (ACTIVE, SUSPENDED, INACTIVE).
export default function UpdateUserStatusPage(): React.JSX.Element {
  // Static visual UI states
  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "SUSPENDED" | "INACTIVE">("SUSPENDED");
  const showModal = false; // Toggle to view Deactivate modal
  const isSuccess = false; // Toggle to view Success state
  const isError = false;   // Toggle to view Error state

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
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Status Updated</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 text-center max-w-sm">
          The user's account status has been updated successfully.
        </p>
        <Link 
          to={`/users/${dummyUser.id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to User
        </Link>
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
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Unable to update status</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 text-center max-w-sm leading-relaxed">
          Something went wrong while updating this user's account status. Please try again.
        </p>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="px-6 py-2.5 bg-accent hover:bg-accent/80 text-foreground text-sm font-semibold rounded-xl border border-border transition-all"
          >
            Try Again
          </button>
          <Link 
            to={`/users/${dummyUser.id}`}
            className="px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all"
          >
            Back to User
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <Link 
          to="/users" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Users
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Update User Status
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Change this user's account status.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. USER SUMMARY */}
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

        {/* 3. STATUS SELECTION CARD */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Account Status</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the status that best represents the current state of this account.
              </p>
            </div>

            <div className="space-y-3">
              
              {/* Option: ACTIVE */}
              <label 
                className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStatus === "ACTIVE" 
                    ? "border-emerald-500 bg-emerald-500/5 shadow-sm" 
                    : "border-border hover:border-muted-foreground bg-card"
                }`}
              >
                <div className="pt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedStatus === "ACTIVE" 
                      ? "border-emerald-500 bg-emerald-500" 
                      : "border-muted-foreground bg-transparent"
                  }`}>
                    {selectedStatus === "ACTIVE" && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${selectedStatus === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} />
                    <span className="font-bold text-foreground text-sm">ACTIVE</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    User can access CampusFlow normally.
                  </p>
                </div>
                {/* Hidden actual radio input for accessibility */}
                <input 
                  type="radio" 
                  name="status" 
                  value="ACTIVE" 
                  checked={selectedStatus === "ACTIVE"} 
                  onChange={() => setSelectedStatus("ACTIVE")}
                  className="sr-only"
                />
              </label>

              {/* Option: SUSPENDED */}
              <label 
                className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStatus === "SUSPENDED" 
                    ? "border-amber-500 bg-amber-500/5 shadow-sm" 
                    : "border-border hover:border-muted-foreground bg-card"
                }`}
              >
                <div className="pt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedStatus === "SUSPENDED" 
                      ? "border-amber-500 bg-amber-500" 
                      : "border-muted-foreground bg-transparent"
                  }`}>
                    {selectedStatus === "SUSPENDED" && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${selectedStatus === "SUSPENDED" ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"}`} />
                    <span className="font-bold text-foreground text-sm">SUSPENDED</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Temporarily restrict this user's access.
                  </p>
                </div>
                <input 
                  type="radio" 
                  name="status" 
                  value="SUSPENDED" 
                  checked={selectedStatus === "SUSPENDED"} 
                  onChange={() => setSelectedStatus("SUSPENDED")}
                  className="sr-only"
                />
              </label>

              {/* Option: INACTIVE */}
              <label 
                className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStatus === "INACTIVE" 
                    ? "border-red-500 bg-red-500/5 shadow-sm" 
                    : "border-border hover:border-muted-foreground bg-card"
                }`}
              >
                <div className="pt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedStatus === "INACTIVE" 
                      ? "border-red-500 bg-red-500" 
                      : "border-muted-foreground bg-transparent"
                  }`}>
                    {selectedStatus === "INACTIVE" && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <UserX className={`w-4 h-4 ${selectedStatus === "INACTIVE" ? "text-red-600 dark:text-red-500" : "text-muted-foreground"}`} />
                    <span className="font-bold text-foreground text-sm">INACTIVE</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Deactivate this account. The user can be reactivated later by an administrator.
                  </p>
                </div>
                <input 
                  type="radio" 
                  name="status" 
                  value="INACTIVE" 
                  checked={selectedStatus === "INACTIVE"} 
                  onChange={() => setSelectedStatus("INACTIVE")}
                  className="sr-only"
                />
              </label>

            </div>

            {/* 4. STATUS EXPLANATION */}
            <div className="bg-accent/30 border border-border/60 rounded-xl p-4 flex items-start gap-3 mt-6 transition-all">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                {selectedStatus === "ACTIVE" && "User can access CampusFlow normally."}
                {selectedStatus === "SUSPENDED" && "Temporarily restrict this user's access."}
                {selectedStatus === "INACTIVE" && "Deactivate this account. The user can be reactivated later by an administrator."}
              </div>
            </div>

          </div>

          {/* 5. ACTION AREA */}
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
              Update Status
            </button>
          </div>

        </div>
      </div>

      {/* 6. DESTRUCTIVE CONFIRMATION MODAL (Static Visual UI Only) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 mb-4 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Deactivate User?</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Are you sure you want to deactivate this account? The user will no longer be able to access CampusFlow normally.
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
