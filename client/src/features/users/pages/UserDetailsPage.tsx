import React, { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Shield,
  Key,
  Clock,
  AlertTriangle,
  UserX,
  Trash2,
  AlertCircle,
  Check
} from "lucide-react";

// GET /api/users/:id
// Admin-only detailed view of one user account and profile information.
export default function UserDetailsPage(): React.JSX.Element {
  // --- UI STATES (Static/Dummy) ---
  const isLoading = false;
  const isError = false;
  
  // Modal state for admin status change modal
  const [activeModal, setActiveModal] = useState<"status" | "deactivate" | null>(null);

  const dummyUser = {
    id: "USR-001",
    firstName: "Ashu",
    lastName: "Patel",
    email: "ashu@example.com",
    role: "STUDENT",
    status: "Active", // Options: Active, Suspended, Inactive
    verified: true,
    joined: "Aug 12, 2026",
    lastUpdated: "Aug 13, 2026",
    initials: "AP"
  };

  // Visual placeholder demo UI only (Activity logging is not a connected backend feature)
  const activityLog = [
    { id: 1, action: "Password changed", date: "Aug 13, 2026, 09:41 AM" },
    { id: 2, action: "Profile updated", date: "Aug 13, 2026, 08:30 AM" },
    { id: 3, action: "Email verified", date: "Aug 12, 2026, 11:15 AM" },
    { id: 4, action: "Account created", date: "Aug 12, 2026, 11:00 AM" },
  ];

  // 11. EMPTY/ERROR UI
  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">User not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-sm">
          Unable to load user information. The user ID may be incorrect.
        </p>
        <Link 
          to="/users"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>
    );
  }

  // 10. LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-pulse">
        <div className="w-32 h-4 bg-muted rounded mb-6" />
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="w-48 h-8 bg-muted rounded" />
            <div className="w-64 h-4 bg-muted rounded" />
          </div>
          <div className="w-32 h-10 bg-muted rounded-xl" />
        </div>
        
        {/* Profile Header Skeleton */}
        <div className="h-32 bg-card border border-border rounded-2xl p-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-card border border-border rounded-2xl" />
            <div className="h-48 bg-card border border-border rounded-2xl" />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="h-40 bg-card border border-border rounded-2xl" />
            <div className="h-40 bg-card border border-border rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
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

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              User Details
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              View account and profile information.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to={`/users/${dummyUser.id}/status`}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-accent hover:bg-accent/80 text-foreground text-sm font-semibold rounded-xl border border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              Change Status
            </Link>
          </div>
        </div>
      </div>

      {/* 2. USER PROFILE HEADER */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl sm:text-3xl font-bold shadow-md shrink-0">
          {dummyUser.initials}
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {dummyUser.firstName} {dummyUser.lastName}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider uppercase">
                {dummyUser.role}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {dummyUser.status}
              </span>
              {dummyUser.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {dummyUser.email}
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              ID: <span className="font-mono text-foreground/80">{dummyUser.id}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined {dummyUser.joined}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Details & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. PROFILE INFORMATION */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
            </div>
            <div className="p-5 sm:p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">First Name</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.firstName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last Name</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.lastName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Role</dt>
                  <dd className="text-sm font-medium text-foreground capitalize">{dummyUser.role.toLowerCase()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Account Status</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.status}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email Verification</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.verified ? "Verified" : "Unverified"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Member Since</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.joined}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last Updated</dt>
                  <dd className="text-sm font-medium text-foreground">{dummyUser.lastUpdated}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 5. SECURITY / VERIFICATION CARD */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Security & Verification</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-6">
              
              <div className="flex items-start gap-4 pb-6 border-b border-border/50">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Email Verification</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Verified</p>
                  <p className="text-xs text-muted-foreground mt-1">Email address has been verified.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Account Security</h4>
                  <p className="text-sm text-foreground font-medium mt-0.5">Protected</p>
                  <p className="text-xs text-muted-foreground mt-1">Account credentials are securely stored.</p>
                </div>
              </div>

            </div>
          </div>
          
        </div>

        {/* Right Column: Status, Activity, Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 4. ACCOUNT STATUS CARD */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Account Status</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This account is currently active and can access CampusFlow.
              </p>
              <Link 
                to={`/users/${dummyUser.id}/status`}
                className="block text-center w-full mt-2 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-sm font-medium rounded-xl border border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Change Status
              </Link>
            </div>
          </div>

          {/* 7. ACTIVITY INFORMATION (Visual Demo Placeholder Only) */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-accent text-muted-foreground rounded-md">Demo</span>
            </div>
            <div className="p-5">
              <div className="relative border-l border-border/60 ml-3 space-y-6">
                {activityLog.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{log.action}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {log.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. ADMIN ACTIONS */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Admin Actions</h3>
            </div>
            <div className="p-5 space-y-3">
              {/* PATCH /api/users/:id/status */}
              <Link 
                to={`/users/${dummyUser.id}/status`}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-accent/30 hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all text-left"
              >
                <Activity className="w-4 h-4 text-muted-foreground" />
                Change Status
              </Link>
              {/* DELETE /api/users/:id (Soft delete: updates status to INACTIVE) */}
              <Link 
                to={`/users/${dummyUser.id}/deactivate`}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-500 text-sm font-medium rounded-xl border border-transparent transition-all text-left"
              >
                <UserX className="w-4 h-4" />
                Deactivate User (Soft Delete)
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
