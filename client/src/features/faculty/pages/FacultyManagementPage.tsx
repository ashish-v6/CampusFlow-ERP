import React, { useState } from "react";
import { Briefcase } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useFaculties } from "../hooks/useFaculties";
import FacultyManagementHeader from "../components/FacultyManagementHeader";
import FacultyStatsCards from "../components/FacultyStatsCards";
import FacultyTableToolbar from "../components/FacultyTableToolbar";
import FacultyTable from "../components/FacultyTable";
import FacultyPagination from "../components/FacultyPagination";
import CreateFacultyModal from "../components/CreateFacultyModal";

/**
 * Main Faculty Management Directory Page.
 * Corresponds to GET /api/faculties
 * Accessible to ADMIN.
 */
export default function FacultyManagementPage(): React.JSX.Element {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const {
    faculties,
    pagination,
    departments,
    stats,
    loading,
    error,
    isEmpty,
    currentPage,
    searchQuery,
    statusFilter,
    departmentFilter,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setDepartmentFilter,
    refreshFaculties,
    resetFilters,
  } = useFaculties(10);

  // Authorization check: Only ADMIN can create faculty
  const canCreate = user?.role === "ADMIN";
  const hasFiltersActive = searchQuery.length > 0 || statusFilter !== "" || departmentFilter !== "";

  // 1. Initial Loading State
  if (loading && !faculties) {
    return (
      <LoadingState
        message="Loading Faculty..."
        subtitle="Fetching faculty directory and departmental assignments."
      />
    );
  }

  // 2. Error State (Network or server failure)
  if (error && !faculties) {
    return (
      <ErrorState
        title="Failed to Load Faculty"
        message={error}
        onRetry={refreshFaculties}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <FacultyManagementHeader
        onRefresh={refreshFaculties}
        onAddFaculty={() => setIsCreateOpen(true)}
        canCreate={canCreate}
      />

      {/* 2. SUMMARY STATS */}
      {stats && <FacultyStatsCards stats={stats} />}

      {/* 3. MAIN TABLE CARD */}
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Table Filters & Search Toolbar */}
        <FacultyTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          departments={departments}
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
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {hasFiltersActive ? "No matching faculty found" : "No faculty appointed yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {hasFiltersActive
                ? "Try adjusting your search terms or clearing your filters."
                : "Create faculty profiles by linking active faculty user accounts to departments."}
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
                Add First Faculty
              </button>
            ) : null}
          </div>
        )}

        {/* Faculty Table View */}
        {!loading && !isEmpty && faculties && <FacultyTable faculties={faculties} />}

        {/* Pagination Controls */}
        {!loading && !isEmpty && pagination && pagination.totalPages > 1 && (
          <FacultyPagination
            paginationDetails={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Create Faculty Modal Dialog */}
      <CreateFacultyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refreshFaculties}
      />
    </div>
  );
}
