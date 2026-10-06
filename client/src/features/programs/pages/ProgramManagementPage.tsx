import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { usePrograms } from "../hooks/usePrograms";
import ProgramManagementHeader from "../components/ProgramManagementHeader";
import ProgramStatsCards from "../components/ProgramStatsCards";
import ProgramTableToolbar from "../components/ProgramTableToolbar";
import ProgramTable from "../components/ProgramTable";
import ProgramPagination from "../components/ProgramPagination";
import CreateProgramModal from "../components/CreateProgramModal";
import UpdateProgramModal from "../components/UpdateProgramModal";
import ProgramStudentsModal from "../components/ProgramStudentsModal";
import { Program } from "../types/program.types";

/**
 * Main Academic Program Management Page.
 * Corresponds to GET /api/programs
 * Accessible to ADMIN, FACULTY, and STUDENT (creation/editing restricted to ADMIN).
 */
export default function ProgramManagementPage(): React.JSX.Element {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [studentsModalProgram, setStudentsModalProgram] = useState<Program | null>(null);

  const {
    programs,
    pagination,
    departments,
    stats,
    loading,
    error,
    isEmpty,
    currentPage,
    searchQuery,
    departmentFilter,
    statusFilter,
    setCurrentPage,
    setSearchQuery,
    setDepartmentFilter,
    setStatusFilter,
    refreshPrograms,
    resetFilters,
  } = usePrograms(10);

  // Authorization check: Only ADMIN can create/edit programs
  const canManage = user?.role === "ADMIN";
  const hasFiltersActive =
    searchQuery.length > 0 || departmentFilter !== "" || statusFilter !== "";

  // 1. Initial Loading State
  if (loading && !programs) {
    return (
      <LoadingState
        message="Loading Academic Programs..."
        subtitle="Fetching degree program directory and curriculum affiliations."
      />
    );
  }

  // 2. Error State (Network or server failure)
  if (error && !programs) {
    return (
      <ErrorState
        title="Failed to Load Programs"
        message={error}
        onRetry={refreshPrograms}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <ProgramManagementHeader
        onRefresh={refreshPrograms}
        onAddProgram={() => setIsCreateOpen(true)}
        canCreate={canManage}
      />

      {/* 2. SUMMARY STATS */}
      {stats && <ProgramStatsCards stats={stats} />}

      {/* 3. MAIN TABLE CARD */}
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Table Filters & Search Toolbar */}
        <ProgramTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
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
                <div className="h-8 w-8 bg-muted rounded-md shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {hasFiltersActive ? "No matching academic programs found" : "No programs registered yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {hasFiltersActive
                ? "Try adjusting your search terms or clearing your filters."
                : "Create academic degree programs and associate them with departments."}
            </p>
            {hasFiltersActive ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            ) : canManage ? (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Add First Program
              </button>
            ) : null}
          </div>
        )}

        {/* Program Table View */}
        {!loading && !isEmpty && programs && (
          <ProgramTable
            programs={programs}
            onEditProgram={(prog) => setEditingProgram(prog)}
            onViewStudents={(prog) => setStudentsModalProgram(prog)}
            canEdit={canManage}
          />
        )}

        {/* Pagination Controls */}
        {!loading && !isEmpty && pagination && pagination.totalPages > 1 && (
          <ProgramPagination
            paginationDetails={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Create Program Modal Dialog */}
      <CreateProgramModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refreshPrograms}
        departments={departments}
      />

      {/* Edit Program Modal Dialog */}
      {editingProgram && (
        <UpdateProgramModal
          isOpen={!!editingProgram}
          onClose={() => setEditingProgram(null)}
          onSuccess={refreshPrograms}
          program={editingProgram}
          departments={departments}
        />
      )}

      {/* View Enrolled Students Modal Dialog */}
      {studentsModalProgram && (
        <ProgramStudentsModal
          isOpen={!!studentsModalProgram}
          onClose={() => setStudentsModalProgram(null)}
          program={studentsModalProgram}
        />
      )}
    </div>
  );
}
