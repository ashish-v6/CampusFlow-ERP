import React, { useEffect, useState } from "react";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import AccountOverviewCard from "../components/AccountOverviewCard";
import PersonalInfoForm from "../components/PersonalInfoForm";
import AccountSecurityCard from "../components/AccountSecurityCard";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { GraduationCap, Briefcase, Building2, Calendar, Phone, MapPin } from "lucide-react";
import { getProfile } from "../services/profile.services";
import { User } from "../profile.types";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";

export default function ProfilePage(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProfile();
      setUser(data.user);
    } catch (err: unknown) {
      console.error("Fetch profile error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to load profile data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <LoadingState
        message="Loading Profile..."
        subtitle="Retrieving your account information and institutional records."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Profile"
        message={error}
        onRetry={fetchProfile}
      />
    );
  }

  if (!user) {
    return (
      <ErrorState
        title="Profile Error"
        message="User profile data could not be found."
        onRetry={fetchProfile}
      />
    );
  }

  const isStudent = user.role?.toUpperCase() === "STUDENT";
  const isFaculty = user.role?.toUpperCase() === "FACULTY";

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your personal account information and institutional credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Summary & Account Info */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileSummaryCard user={user} />
          <AccountOverviewCard user={user} />

          {/* Academic Student Profile Card for Students */}
          {isStudent && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Academic Profile</h3>
              </div>
              <div className="space-y-2 text-xs">
                {user.student ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Student ID:</span>
                      <span className="font-mono font-semibold text-foreground">
                        {user.student.studentId}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Program:</span>
                      <span className="font-medium text-foreground">
                        {user.student.program.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium text-foreground">
                        {user.student.program.department.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Student institutional record linked to your user account.
                  </p>
                )}
              </div>
              <Link
                to="/students/me"
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold border border-primary/20 transition-all cursor-pointer mt-2"
              >
                View Full Student Profile &rarr;
              </Link>
            </div>
          )}

          {/* Academic Faculty Profile Card for Faculty */}
          {isFaculty && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Faculty Profile</h3>
              </div>
              <div className="space-y-2 text-xs">
                {user.faculty ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Faculty ID:</span>
                      <span className="font-mono font-semibold text-foreground">
                        {user.faculty.facultyId}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Designation:</span>
                      <span className="font-medium text-foreground">
                        {user.faculty.designation}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium text-foreground">
                        {user.faculty.department.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Faculty institutional appointment linked to your account.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Forms & Security Settings */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoForm
            user={user}
            onUpdate={(updated) => setUser(updated)}
          />
          <AccountSecurityCard />
        </div>
      </div>
    </div>
  );
}
