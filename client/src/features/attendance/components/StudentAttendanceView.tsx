import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Percent,
  Calendar,
  Filter,
  RotateCcw,
} from "lucide-react";
import {
  AttendancePaginationMeta,
  AttendanceRecord,
  AttendanceStatus,
  StudentAttendanceSummary,
} from "../types/attendance.types";
import { getMyAttendance, mapAttendanceError } from "../services/attendance.service";
import { convertYmdToDdMmYyyy } from "../utils/attendanceDate.utils";
import { validateDateRange } from "../validation/attendance.validation";
import AttendanceTable from "./AttendanceTable";
import AttendancePagination from "./AttendancePagination";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";

export default function StudentAttendanceView(): React.JSX.Element {
  const [attendances, setAttendances] = useState<AttendanceRecord[] | null>(null);
  const [pagination, setPagination] = useState<AttendancePaginationMeta | null>(null);
  const [summary, setSummary] = useState<StudentAttendanceSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Validate date range
  useEffect(() => {
    const rangeCheck = validateDateRange(fromDate, toDate);
    if (!rangeCheck.isValid) {
      setDateRangeError(rangeCheck.error || "Invalid date range");
    } else {
      setDateRangeError(null);
    }
  }, [fromDate, toDate]);

  // Reset page when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [statusFilter, fromDate, toDate]);

  const fetchStudentData = useCallback(async () => {
    if (fromDate && toDate && fromDate > toDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedFrom = fromDate ? convertYmdToDdMmYyyy(fromDate) : undefined;
      const formattedTo = toDate ? convertYmdToDdMmYyyy(toDate) : undefined;

      const response = await getMyAttendance({
        page: currentPage,
        limit: 10,
        status: statusFilter ? statusFilter : undefined,
        fromDate: formattedFrom,
        toDate: formattedTo,
      });

      setAttendances(response.attendances || []);
      setPagination(response.pagination || null);
      setSummary(response.summary || null);
    } catch (err) {
      console.error("Failed to load student attendance:", err);
      const msg = mapAttendanceError(err);
      setError(msg);
      setAttendances(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, fromDate, toDate]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleResetFilters = () => {
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    setDateRangeError(null);
  };

  const hasActiveFilters = fromDate !== "" || toDate !== "" || statusFilter !== "";
  const isEmpty = !loading && (!attendances || attendances.length === 0);

  if (loading && !attendances) {
    return (
      <LoadingState
        message="Loading Your Attendance..."
        subtitle="Retrieving your institutional attendance records and summary."
      />
    );
  }

  if (error && !attendances) {
    return (
      <ErrorState
        title="Failed to Load Attendance"
        message={error}
        onRetry={fetchStudentData}
      />
    );
  }

  const totalSessions = summary?.total ?? 0;
  const presentCount = summary?.present ?? 0;
  const absentCount = summary?.absent ?? 0;
  const attendanceRate =
    summary?.percentage !== undefined
      ? summary.percentage
      : totalSessions > 0
        ? Math.round((presentCount / totalSessions) * 100 * 10) / 10
        : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              My Attendance
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review your academic attendance record and overall participation rate.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchStudentData}
          disabled={loading}
          className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent border border-border rounded-xl transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
          title="Refresh attendance"
          aria-label="Refresh attendance"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* 2. Student Personal Attendance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sessions */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Sessions
            </span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{totalSessions}</div>
          <p className="text-[11px] text-muted-foreground">Total calendar sessions marked</p>
        </div>

        {/* Present Sessions */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Present
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">{presentCount}</div>
          <p className="text-[11px] text-muted-foreground">Recorded present days</p>
        </div>

        {/* Absent Sessions */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Absent
            </span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">{absentCount}</div>
          <p className="text-[11px] text-muted-foreground">Recorded absent days</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attendance Rate
            </span>
            <Percent className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">{attendanceRate}%</div>
          <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                attendanceRate >= 75
                  ? "bg-emerald-500"
                  : attendanceRate >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(Math.max(attendanceRate, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Table Card */}
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Filters Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-bold text-foreground">Attendance History</div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
            {/* From Date */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                aria-label="From Date"
                className="px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
              />
            </div>

            {/* To Date */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                aria-label="To Date"
                className="px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | "")}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
            >
              <option value="">All statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {dateRangeError && (
          <p className="text-red-500 text-xs font-medium px-5 py-2 border-b border-border text-right">
            {dateRangeError}
          </p>
        )}

        {/* Loading Skeleton */}
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
                <div className="h-6 bg-muted rounded-full w-24" />
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
              {hasActiveFilters
                ? "No attendance records found for this period"
                : "You have no attendance records yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {hasActiveFilters
                ? "Try adjusting or clearing your date range and status filters."
                : "Your faculty or department will mark your daily academic attendance."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Table View */}
        {!loading && !isEmpty && attendances && (
          <AttendanceTable attendances={attendances} />
        )}

        {/* Pagination */}
        {!loading && !isEmpty && pagination && pagination.totalPages > 1 && (
          <AttendancePagination
            paginationDetails={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
