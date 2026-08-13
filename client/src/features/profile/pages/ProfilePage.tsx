import React from "react";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import AccountOverviewCard from "../components/AccountOverviewCard";
import PersonalInfoForm from "../components/PersonalInfoForm";
import AccountSecurityCard from "../components/AccountSecurityCard";
import { useAuth } from "../../../context/Auth/useAuth";

// GET /api/users/me & PATCH /api/users/me
// Displays authenticated user's profile information and encapsulates basic profile editing (firstName, lastName).
export default function ProfilePage(): React.JSX.Element {
  // Dummy data

  const auth = useAuth();
  const realUser = auth.user;

  const user = {
    firstName: realUser?.firstName as string,
    lastName: realUser?.lastName as string,
    email: realUser?.email as string,
    role: realUser?.role as string,
    status: realUser?.status as string,
    verified: realUser?.isVerified as boolean,
    memberSince: realUser?.createdAt as Date,
    initials: "AP"
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your personal account information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Summary & Account Info */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileSummaryCard user={user} />
          <AccountOverviewCard user={user} />
        </div>

        {/* Right Column: Forms & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoForm user={user} />
          <AccountSecurityCard />
        </div>
      </div>
    </div>
  );
}
