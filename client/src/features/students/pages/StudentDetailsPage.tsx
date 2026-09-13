import React, { useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useStudentDetails } from "../hooks/useStudentDetails";
import StudentDetailsHeader from "../components/StudentDetailsHeader";
import StudentProfileHeaderCard from "../components/StudentProfileHeaderCard";
import StudentPersonalInfoCard from "../components/StudentPersonalInfoCard";
import StudentAcademicInfoCard from "../components/StudentAcademicInfoCard";
import UpdateStudentModal from "../components/UpdateStudentModal";

/**
 * Student Details & Profile Page.
 * Corresponds to GET /api/students/:id
 * 
 * Authorization & Ownership rules:
 * - ADMIN & FACULTY: Allowed to view any student and perform administrative edits.
 * - STUDENT: Allowed only to view their own student record.
 *   Ownership check verifies: student.userId === authenticatedUser.id
 */
export default function StudentDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  const { student, loading, error, refreshStudent } = useStudentDetails(id);

  // 1. Loading State
  if (loading) {
    return (
      <LoadingState
        message="Loading Student Profile..."
        subtitle="Retrieving student personal and academic records."
      />
    );
  }

  // 2. Fetch or Server Error State
  if (error || !student) {
    return (
      <ErrorState
        title="Student Not Found"
        message={error || "Unable to retrieve student profile. The record may not exist."}
        backUrl={user?.role === "STUDENT" ? "/dashboard" : "/students"}
        backText={user?.role === "STUDENT" ? "Back to Dashboard" : "Back to Students"}
        onRetry={refreshStudent}
      />
    );
  }

  // 3. Client Ownership Verification for STUDENT Role:
  // Non-obvious logic: Student.id is the institutional student record UUID,
  // whereas User.id is the authentication account UUID.
  // Ownership is strictly evaluated against student.userId or student.user?.id.
  const isStudentRole = user?.role?.toUpperCase() === "STUDENT";
  const studentOwnerId = student.userId || student.user?.id;
  const isOwner = studentOwnerId === user?.id;

  if (isStudentRole && !isOwner) {
    return (
      <ErrorState
        title="Access Denied"
        message="You are not authorized to view another student's profile. You can only view your own records."
        backUrl="/dashboard"
        backText="Back to Dashboard"
      />
    );
  }

  // Only ADMIN and STAFF/FACULTY have permission to edit student records
  const userRole = user?.role?.toUpperCase() || "";
  const canEdit = userRole === "ADMIN" || userRole === "FACULTY" || userRole === "STAFF";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <StudentDetailsHeader
        studentId={student.id}
        onEdit={() => setIsUpdateOpen(true)}
        canEdit={canEdit}
        backUrl={isStudentRole ? "/dashboard" : "/students"}
        backText={isStudentRole ? "Back to Dashboard" : "Back to Students"}
      />

      {/* 2. PROFILE SUMMARY CARD */}
      <StudentProfileHeaderCard student={student} />

      {/* 3. INFORMATION CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (2 cols): Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <StudentPersonalInfoCard student={student} />
        </div>

        {/* Right Column (1 col): Academic Information */}
        <div className="lg:col-span-1 space-y-6">
          <StudentAcademicInfoCard student={student} />
        </div>
      </div>

      {/* Update Student Modal Dialog */}
      {canEdit && (
        <UpdateStudentModal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSuccess={refreshStudent}
          student={student}
        />
      )}
    </div>
  );
}
