import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useStudents } from "../hooks/useStudents";
import StudentManagementHeader from "../components/StudentManagementHeader";
import StudentTableToolbar from "../components/StudentTableToolbar";
import StudentTable from "../components/StudentTable";
import StudentPagination from "../components/StudentPagination";
import CreateStudentModal from "../components/CreateStudentModal";
import StudentStatsCards from "../components/StudentStatsCards";

/**
 * Main Student Management Directory Page.
 * Corresponds to GET /api/students
 * Accessible to ADMIN and FACULTY/STAFF.
 */
export default function StudentManagementPage(): React.JSX.Element {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const {
    students,
    pagination,
    programs,
    stats,
    loading,
    error,
    isEmpty,
    currentPage,
    searchQuery,
    statusFilter,
    programFilter,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setProgramFilter,
    refreshStudents,
    resetFilters,
  } = useStudents(10);

  // Authorization check: Only ADMIN and FACULTY can create students
  const canCreate = user?.role === "ADMIN" || user?.role === "FACULTY";
  const hasFiltersActive = searchQuery.length > 0 || statusFilter !== "" || programFilter !== "";

  // 1. Initial Loading State
  if (loading && !students) {
    return (
      <LoadingState
        message="Loading Students..."
        subtitle="Fetching student directory and academic enrollments."
      />
    );
  }

  // 2. Error State (Network or server failure)
  if (error && !students) {
    return (
      <ErrorState
        title="Failed to Load Students"
        message={error}
        onRetry={refreshStudents}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <StudentManagementHeader
        onRefresh={refreshStudents}
        onAddStudent={() => setIsCreateOpen(true)}
        canCreate={canCreate}
      />

      {/* 2. SUMMARY STATS (Matches UserStatsCards on User Management Page) */}
      {stats && <StudentStatsCards stats={stats} />}

      {/* 3. MAIN TABLE CARD */}
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Table Filters & Search Toolbar */}
        <StudentTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          programFilter={programFilter}
          onProgramChange={setProgramFilter}
          programs={programs}
          onResetFilters={resetFilters}
        />

        {/* Loading Skeleton during filter transition */}
        {loading && (
          <div className="p-5 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border/50">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/5" />
                </div>
                <div className="hidden sm:block h-6 bg-muted rounded-full w-20" />
                <div className="hidden lg:block h-6 bg-muted rounded-full w-24" />
                <div className="h-8 w-8 bg-muted rounded-md shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {hasFiltersActive ? "No matching students found" : "No students enrolled yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {hasFiltersActive
                ? "Try adjusting your search terms or clearing your filters."
                : "Create student profiles by linking active student user accounts to programs."}
            </p>
            {hasFiltersActive ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            ) : canCreate ? (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Add First Student
              </button>
            ) : null}
          </div>
        )}

        {/* Student Table View */}
        {!loading && !isEmpty && students && <StudentTable students={students} />}

        {/* Pagination Controls */}
        {!loading && !isEmpty && pagination && pagination.totalPages > 1 && (
          <StudentPagination
            paginationDetails={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Create Student Modal Dialog */}
      <CreateStudentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refreshStudents}
      />
    </div>
  );
}
