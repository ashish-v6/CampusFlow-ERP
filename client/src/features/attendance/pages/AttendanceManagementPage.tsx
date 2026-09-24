import React, { useState } from "react";
import { CalendarCheck, Calendar } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useAttendance } from "../hooks/useAttendance";
import AttendanceManagementHeader from "../components/AttendanceManagementHeader";
import AttendanceStatsCards from "../components/AttendanceStatsCards";
import AttendanceToolbar from "../components/AttendanceToolbar";
import AttendanceTable from "../components/AttendanceTable";
import AttendancePagination from "../components/AttendancePagination";
import AttendanceMarkingModal from "../components/AttendanceMarkingModal";
import EditAttendanceModal from "../components/EditAttendanceModal";
import StudentAttendancePage from "./StudentAttendancePage";
import { AttendanceRecord } from "../types/attendance.types";
import { getTodayDateString } from "../utils/attendanceBadgeStyles";

/**
 * Main Attendance Management Directory Page.
 * Corresponds to GET /api/attendance
 * Accessible to ADMIN and FACULTY for management; STUDENT views personal attendance.
 */
export default function AttendanceManagementPage(): React.JSX.Element {
  const { user } = useAuth();

  // If logged-in user is a student, direct to their personal attendance view
  if (user?.role === "STUDENT") {
    return <StudentAttendancePage />;
  }

  const [isMarkingOpen, setIsMarkingOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const {
    attendances,
    pagination,
    departments,
    loading,
    error,
    isEmpty,
    selectedDate,
    departmentFilter,
    statusFilter,
    searchQuery,
    currentPage,
    setSelectedDate,
    setDepartmentFilter,
    setStatusFilter,
    setSearchQuery,
    setCurrentPage,
    refreshAttendances,
    resetFilters,
  } = useAttendance(10);

  const canMark = user?.role === "ADMIN" || user?.role === "FACULTY";
  const canEdit = user?.role === "ADMIN" || user?.role === "FACULTY";

  const isDefaultDate = selectedDate === getTodayDateString();
  const hasActiveFilters =
    !isDefaultDate || departmentFilter !== "" || statusFilter !== "" || searchQuery.length > 0;

  // 1. Initial Loading State
  if (loading && !attendances) {
    return (
      <LoadingState
        message="Loading Attendance..."
        subtitle="Fetching attendance records and departmental information."
      />
    );
  }

  // 2. Error State
  if (error && !attendances) {
    return (
      <ErrorState
        title="Failed to Load Attendance"
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
        onMarkAttendance={() => setIsMarkingOpen(true)}
        canMark={canMark}
      />

      {/* 2. SUMMARY STATS */}
      {attendances && (
        <AttendanceStatsCards
          records={attendances}
          totalFromMeta={pagination?.total}
        />
      )}

      {/* 3. MAIN TABLE CARD */}
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Table Filters & Search Toolbar */}
        <AttendanceToolbar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departments={departments}
          onResetFilters={resetFilters}
        />

        {/* Loading Skeleton during filter transition */}
        {loading && (
          <div className="p-5 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border/50">
                <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/5" />
                </div>
                <div className="hidden sm:block h-6 bg-muted rounded-full w-24" />
                <div className="hidden lg:block h-6 bg-muted rounded-full w-20" />
                <div className="h-8 w-16 bg-muted rounded-md shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {hasActiveFilters ? "No matching attendance records" : "No attendance recorded for this date"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {hasActiveFilters
                ? "Try adjusting your search criteria, selecting another date, or resetting filters."
                : "Begin recording student attendance for this date using the bulk attendance marking tool."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            ) : canMark ? (
              <button
                type="button"
                onClick={() => setIsMarkingOpen(true)}
                className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Mark Attendance Now
              </button>
            ) : null}
          </div>
        )}

        {/* Attendance Table View */}
        {!loading && !isEmpty && attendances && (
          <AttendanceTable
            attendances={attendances}
            onEdit={(record) => setEditingRecord(record)}
            canEdit={canEdit}
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

      {/* Bulk Mark Attendance Modal */}
      {canMark && (
        <AttendanceMarkingModal
          isOpen={isMarkingOpen}
          onClose={() => setIsMarkingOpen(false)}
          onSuccess={() => {
            refreshAttendances();
          }}
          initialDate={selectedDate}
          initialDepartmentId={departmentFilter}
        />
      )}

      {/* Edit Attendance Record Modal */}
      {canEdit && (
        <EditAttendanceModal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          onSuccess={() => {
            refreshAttendances();
          }}
          record={editingRecord}
        />
      )}
    </div>
  );
}
