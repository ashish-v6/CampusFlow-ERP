import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchUser, setUsersStatus } from "../service/users.service";
import { AxiosError } from "axios";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { UserDetails, Status } from "../users.types";
import UpdateUserStatusHeader from "../components/UpdateUserStatusHeader";
import UserStatusSummaryCard from "../components/UserStatusSummaryCard";
import UpdateUserStatusForm from "../components/UpdateUserStatusForm";

// PATCH /api/users/:id/status
// Admin-only UI for changing the target user's account status (ACTIVE, SUSPENDED).
export default function UpdateUserStatusPage(): React.JSX.Element {
  const navigate = useNavigate();
  // Static visual UI states
  const [selectedStatus, setSelectedStatus] = useState<Status>("SUSPENDED");
  const [isSuccess, SetIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState(false);

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedStatus === user?.status) {
      return;
    }

    try {
      setButtonState(true);
      await setUsersStatus(id as string, { status: selectedStatus });
      SetIsSuccess(true);
    } catch (error) {
      setError(true);
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    } finally {
      setButtonState(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [buttonState]);

  if (loading) {
    return (
      <LoadingState
        message="Loading User Information..."
        subtitle="Please wait while user details are loaded."
      />
    );
  }

  if (!user) {
    return (
      <ErrorState
        title="User Not Found"
        message="Unable to load user information for status update."
        backUrl="/users"
        backText="Back to Users"
      />
    );
  }

  // 7. SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Status Updated
        </h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 text-center max-w-sm">
          The user's account status has been updated successfully.
        </p>
        <Link
          to={`/users/${user.id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to User
        </Link>
      </div>
    );
  }

  // 8. ERROR STATE
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 mb-5 border border-red-500/20 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Unable to update status
        </h2>
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
            to={`/users/${user.id}`}
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
      <UpdateUserStatusHeader />

      <div className="space-y-6">
        {/* 2. USER SUMMARY */}
        <UserStatusSummaryCard user={user} />

        {/* 3. STATUS SELECTION CARD & ACTION AREA */}
        <UpdateUserStatusForm
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleSubmit={handleSubmit}
          userId={user.id}
          loading={loading}
        />
      </div>
    </div>
  );
}
