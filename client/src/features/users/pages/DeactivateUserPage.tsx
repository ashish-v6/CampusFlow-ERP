import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { deactivateUser, fetchUser } from "../service/users.service";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { UserDetails } from "../users.types";
import DeactivateUserHeader from "../components/DeactivateUserHeader";
import UserStatusSummaryCard from "../components/UserStatusSummaryCard";
import DeactivateWarningCard from "../components/DeactivateWarningCard";
import DeactivateConfirmationCard from "../components/DeactivateConfirmationCard";
import DeactivateUserModal from "../components/DeactivateUserModal";

// DELETE /api/users/:id
// Admin-only soft delete request. Updates target user's status to INACTIVE, retaining historical data.
export default function DeactivateUserPage(): React.JSX.Element {
  // Static visual UI states
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, SetIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleDeactive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setButtonState(true);
    try {
      await deactivateUser(id as string);
      SetIsSuccess(true);
    } catch (e) {
      console.log(e);
    } finally {
      setButtonState(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <LoadingState
        message="Loading User..."
        subtitle="Fetching user account and status statistics."
      />
    );
  }

  if (!user) {
    return (
      <ErrorState
        title="No User Found"
        message="Unable to retrieve user details."
        onRetry={getUser}
      />
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
          Unable to deactivate user
        </h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 text-center max-w-sm leading-relaxed">
          The account could not be deactivated. Please try again or contact support if the issue
          persists.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to={`/users/${user.id}`}
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

  // 7. SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          User Deactivated
        </h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6 text-center max-w-sm">
          {user.firstName} {user.lastName}'s account has been marked as INACTIVE.
        </p>

        <div className="flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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
            to={`/users/${user.id}`}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 text-center"
          >
            Back to User
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500 relative">
      {/* 1. PAGE HEADER */}
      <DeactivateUserHeader userId={user.id} />

      <div className="space-y-6">
        {/* 2. USER SUMMARY CARD */}
        <UserStatusSummaryCard user={user} />

        {/* 3. DEACTIVATION WARNING CARD */}
        <DeactivateWarningCard />

        {/* 4. CONFIRMATION SECTION & 5. ACTION BUTTONS */}
        <DeactivateConfirmationCard
          user={user}
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
          onOpenModal={() => setShowModal(true)}
        />
      </div>

      {/* 6. CONFIRMATION MODAL */}
      <DeactivateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeactive}
        userName={`${user.firstName} ${user.lastName}`}
        buttonState={buttonState}
      />
    </div>
  );
}
