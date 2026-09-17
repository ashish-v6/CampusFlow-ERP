import React, { useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useFacultyDetails } from "../hooks/useFacultyDetails";
import FacultyDetailsHeader from "../components/FacultyDetailsHeader";
import FacultyProfileHeaderCard from "../components/FacultyProfileHeaderCard";
import FacultyPersonalInfoCard from "../components/FacultyPersonalInfoCard";
import FacultyInstitutionalInfoCard from "../components/FacultyInstitutionalInfoCard";
import UpdateFacultyModal from "../components/UpdateFacultyModal";

/**
 * Faculty Details & Profile Page.
 * Corresponds to GET /api/faculties/:id
 * 
 * Authorization:
 * - ADMIN: Allowed to view and edit any faculty.
 * - FACULTY: Allowed to view faculty profile.
 */
export default function FacultyDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  const { faculty, loading, error, refreshFaculty } = useFacultyDetails(id);

  // 1. Loading State
  if (loading) {
    return (
      <LoadingState
        message="Loading Faculty Profile..."
        subtitle="Retrieving faculty personal and departmental records."
      />
    );
  }

  // 2. Fetch or Server Error State
  if (error || !faculty) {
    return (
      <ErrorState
        title="Faculty Record Not Found"
        message={error || "Unable to retrieve faculty profile. The record may not exist."}
        backUrl={user?.role === "ADMIN" ? "/faculty" : "/dashboard"}
        backText={user?.role === "ADMIN" ? "Back to Faculty" : "Back to Dashboard"}
        onRetry={refreshFaculty}
      />
    );
  }

  // Permission: Only ADMIN can edit faculty records
  const userRole = user?.role?.toUpperCase() || "";
  const canEdit = userRole === "ADMIN";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <FacultyDetailsHeader
        facultyId={faculty.id}
        onEdit={() => setIsUpdateOpen(true)}
        canEdit={canEdit}
        backUrl={user?.role === "ADMIN" ? "/faculty" : "/dashboard"}
        backText={user?.role === "ADMIN" ? "Back to Faculty" : "Back to Dashboard"}
      />

      {/* 2. PROFILE SUMMARY CARD */}
      <FacultyProfileHeaderCard faculty={faculty} />

      {/* 3. INFORMATION CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (2 cols): Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <FacultyPersonalInfoCard faculty={faculty} />
        </div>

        {/* Right Column (1 col): Institutional Information */}
        <div className="lg:col-span-1 space-y-6">
          <FacultyInstitutionalInfoCard faculty={faculty} />
        </div>
      </div>

      {/* Update Faculty Modal Dialog */}
      {canEdit && (
        <UpdateFacultyModal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSuccess={refreshFaculty}
          faculty={faculty}
        />
      )}
    </div>
  );
}
