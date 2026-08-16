import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchUser } from "../service/users.service";
import ErrorState from "../../../components/ErrorState";
import { UserDetails, ActivityLogItem } from "../users.types";
import UserDetailsHeader from "../components/UserDetailsHeader";
import UserProfileHeaderCard from "../components/UserProfileHeaderCard";
import UserProfileInfoCard from "../components/UserProfileInfoCard";
import UserSecurityCard from "../components/UserSecurityCard";
import UserAccountStatusCard from "../components/UserAccountStatusCard";
import UserActivityLogCard from "../components/UserActivityLogCard";
import UserAdminActionsCard from "../components/UserAdminActionsCard";

// GET /api/users/:id
// Admin-only detailed view of one user account and profile information.
export default function UserDetailsPage(): React.JSX.Element {
  // --- UI STATES (Static/Dummy) ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  // Modal state for admin status change modal
  const [activeModal, setActiveModal] = useState<"status" | "deactivate" | null>(null);
  const { id } = useParams();

  const getUser = async () => {
    try {
      const data = await fetchUser(id as string);
      setUser(data.result);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Visual placeholder demo UI only (Activity logging is not a connected backend feature)
  const activityLog: Array<ActivityLogItem> = [
    { id: 1, action: "Password changed", date: "Aug 13, 2026, 09:41 AM" },
    { id: 2, action: "Profile updated", date: "Aug 13, 2026, 08:30 AM" },
    { id: 3, action: "Email verified", date: "Aug 12, 2026, 11:15 AM" },
    { id: 4, action: "Account created", date: "Aug 12, 2026, 11:00 AM" },
  ];

  useEffect(() => {
    getUser();
  }, []);

  // 10. LOADING STATE
  if (loading) {
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

  // 11. EMPTY/ERROR UI
  if (error || !user) {
    return (
      <ErrorState
        title="User Not Found"
        message="Unable to load user information. The user ID may be incorrect."
        backUrl="/users"
        backText="Back to Users"
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <UserDetailsHeader userId={user.id} />

      {/* 2. USER PROFILE HEADER */}
      <UserProfileHeaderCard user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Details & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3. PROFILE INFORMATION */}
          <UserProfileInfoCard user={user} />

          {/* 5. SECURITY / VERIFICATION CARD */}
          <UserSecurityCard user={user} />
        </div>

        {/* Right Column: Status, Activity, Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* 4. ACCOUNT STATUS CARD */}
          <UserAccountStatusCard user={user} />

          {/* 7. ACTIVITY INFORMATION (Visual Demo Placeholder Only) */}
          <UserActivityLogCard activityLog={activityLog} />

          {/* 6. ADMIN ACTIONS */}
          <UserAdminActionsCard userId={user.id} />
        </div>
      </div>
    </div>
  );
}
