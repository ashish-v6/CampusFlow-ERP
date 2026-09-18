import React, { useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useDepartmentDetails } from "../hooks/useDepartmentDetails";
import DepartmentDetailsHeader from "../components/DepartmentDetailsHeader";
import DepartmentProfileHeaderCard from "../components/DepartmentProfileHeaderCard";
import DepartmentInfoCard from "../components/DepartmentInfoCard";
import UpdateDepartmentModal from "../components/UpdateDepartmentModal";

/**
 * Department Details & Profile Page.
 * Corresponds to GET /api/departments/:id
 * 
 * Authorization:
 * - ADMIN: Allowed to view and edit any department.
 */
export default function DepartmentDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  const { department, loading, error, refreshDepartment } = useDepartmentDetails(id);

  // 1. Loading State
  if (loading) {
    return (
      <LoadingState
        message="Loading Department..."
        subtitle="Retrieving department record and operational status."
      />
    );
  }

  // 2. Fetch or Server Error State
  if (error || !department) {
    return (
      <ErrorState
        title="Department Not Found"
        message={error || "Unable to retrieve department record. It may not exist."}
        backUrl="/departments"
        backText="Back to Departments"
        onRetry={refreshDepartment}
      />
    );
  }

  // Permission: Only ADMIN can edit department records
  const userRole = user?.role?.toUpperCase() || "";
  const canEdit = userRole === "ADMIN";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <DepartmentDetailsHeader
        departmentId={department.id}
        onEdit={() => setIsUpdateOpen(true)}
        canEdit={canEdit}
        backUrl="/departments"
        backText="Back to Departments"
      />

      {/* 2. PROFILE SUMMARY CARD */}
      <DepartmentProfileHeaderCard department={department} />

      {/* 3. INFORMATION CARDS */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        <DepartmentInfoCard department={department} />
      </div>

      {/* Update Department Modal Dialog */}
      {canEdit && (
        <UpdateDepartmentModal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSuccess={refreshDepartment}
          department={department}
        />
      )}
    </div>
  );
}
