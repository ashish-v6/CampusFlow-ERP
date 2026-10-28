import React, { useState } from "react";
import { CalendarCheck, Plus, Users } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useAttendance } from "../hooks/useAttendance";
import AttendanceManagementHeader from "../components/AttendanceManagementHeader";
import AttendanceSummaryCards from "../components/AttendanceSummaryCards";
import AttendanceTableToolbar from "../components/AttendanceTableToolbar";
import AttendanceTable from "../components/AttendanceTable";
import AttendancePagination from "../components/AttendancePagination";
import MarkAttendanceModal from "../components/MarkAttendanceModal";
import BulkMarkAttendanceModal from "../components/BulkMarkAttendanceModal";
import EditAttendanceModal from "../components/EditAttendanceModal";
import ViewAttendanceModal from "../components/ViewAttendanceModal";
import StudentAttendanceView from "../components/StudentAttendanceView";
import { AttendanceRecord } from "../types/attendance.types";

/**
 * Main Attendance Management Directory Page.
 * Corresponds to GET & POST /api/attendance
 * Accessible by ADMIN, FACULTY, and STUDENT (students view their own attendance).
 */
export default function AttendanceManagementPage(): React.JSX.Element {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase();

  // 1. If authenticated user is a STUDENT, display their dedicated personal attendance view
  if (userRole === "STUDENT") {
    return <StudentAttendanceView />;
  }

  // 2. Administrative View for ADMIN & FACULTY
  const [isMarkModalOpen, setIsMarkModalOpen] = useState<boolean>(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [selectedRecordForEdit, setSelectedRecordForEdit] =
    useState<AttendanceRecord | null>(null);
  const [selectedRecordIdForView, setSelectedRecordIdForView] = useState<string | null>(
    null,
  );

  const {
    attendances,
    pagination,
    stats,
    loading,
    statsLoading,
    error,
    isEmpty,
    currentPage,
    statusFilter,
    fromDate,
    toDate,
    studentSearch,
    dateRangeError,
    setCurrentPage,
    setStatusFilter,
    setFromDate,
    setToDate,
    setStudentSearch,
    refreshAttendances,
    resetFilters,
  } = useAttendance();

  const canCreate = userRole === "ADMIN" || userRole === "FACULTY";
  const hasFiltersActive =
    statusFilter !== "" || fromDate !== "" || toDate !== "" || studentSearch !== "";

  // Initial Loading State
  if (loading && !attendances) {
    return (
      <LoadingState
        message="Loading Attendance Records..."
        subtitle="Fetching student attendance entries from the server."
      />
    );
  }

  // Error State (Network or server failure)
  if (error && !attendances) {
    return (
      <ErrorState
        title="Failed to Load Attendance Records"
        message={error}
        onRetry={refreshAttendances}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <AttendanceManagementHeader
        onRefresh={refreshAttendances}
        onMarkAttendance={() => setIsMarkModalOpen(true)}
        onBulkMarkAttendance={() => setIsBulkModalOpen(true)}
        canCreate={canCreate}
      />

      {/* 2. ATTENDANCE SUMMARY METRICS CARDS */}
      <AttendanceSummaryCards stats={stats} loading={statsLoading} />

      {/* 3. MAIN ATTENDANCE TABLE CARD */}
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Table Filters Toolbar (From Date -> To Date, Status, Search) */}
        <AttendanceTableToolbar
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          studentSearch={studentSearch}
          onStudentSearchChange={setStudentSearch}
          onResetFilters={resetFilters}
          dateRangeError={dateRangeError}
        />

        {/* Loading Skeleton during filter transition */}
        {loading && (
          <div className="p-5 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-border/50"
              >
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/5" />
                </div>
                <div className="hidden sm:block h-6 bg-muted rounded-full w-24" />
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
              <CalendarCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {hasFiltersActive
                ? "No matching attendance records found"
                : "No attendance records yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {hasFiltersActive
                ? "Try clearing or adjusting your date range and status filters."
                : "Start tracking daily attendance by marking individual or bulk attendance."}
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
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Bulk Mark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMarkModalOpen(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mark Individual</span>
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Attendance Table View */}
        {!loading && !isEmpty && attendances && (
          <AttendanceTable
            attendances={attendances}
            onView={(record) => setSelectedRecordIdForView(record.id)}
            onEdit={(record) => setSelectedRecordForEdit(record)}
            canEdit={canCreate}
          />
        )}

        {/* Pagination Controls */}
        {!loading && !isEmpty && pagination && pagination.totalPages > 1 && (
          <AttendancePagination
            paginationDetails={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Individual Mark Attendance Modal Dialog */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        onSuccess={refreshAttendances}
        existingAttendances={attendances || []}
      />

      {/* Bulk Mark Attendance Modal Dialog */}
      <BulkMarkAttendanceModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={refreshAttendances}
      />

      {/* Edit / Correct Attendance Modal Dialog */}
      <EditAttendanceModal
        isOpen={Boolean(selectedRecordForEdit)}
        attendance={selectedRecordForEdit}
        onClose={() => setSelectedRecordForEdit(null)}
        onSuccess={refreshAttendances}
      />

      {/* View Attendance Detail Modal Dialog */}
      <ViewAttendanceModal
        isOpen={Boolean(selectedRecordIdForView)}
        attendanceId={selectedRecordIdForView}
        onClose={() => setSelectedRecordIdForView(null)}
        onEdit={(record) => {
          setSelectedRecordIdForView(null);
          setSelectedRecordForEdit(record);
        }}
        canEdit={canCreate}
      />
    </div>
  );
}
