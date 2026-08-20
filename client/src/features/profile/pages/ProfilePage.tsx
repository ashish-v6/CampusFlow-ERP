import React, { useEffect, useState } from "react";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import AccountOverviewCard from "../components/AccountOverviewCard";
import PersonalInfoForm from "../components/PersonalInfoForm";
import AccountSecurityCard from "../components/AccountSecurityCard";
import { useAuth } from "../../../context/Auth/useAuth";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getProfile } from "../services/profile.services";
import { User } from "../profile.types";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";

// GET /api/users/me & PATCH /api/users/me
// Displays authenticated user's profile information and encapsulates basic profile editing (firstName, lastName).
export default function ProfilePage(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProfile();
      setUser(data.user);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Something happend");
        setError(error.response?.data.message ?? "Something happend");
      } else {
        toast.error("Unexpected Happend");
        setError("Unexpected Happend");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <LoadingState message="Loading Profile..." subtitle="Retrieving your account information." />
    );
  }

  if (error) {
    return <ErrorState title="Failed to Load Profile" message={error} onRetry={getUser} />;
  }

  if (!user) {
    return (
      <ErrorState
        title="Profile Error"
        message="User profile data could not be found."
        onRetry={getUser}
      />
    );
  }

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
