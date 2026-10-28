/**
 * CampusFlow Attendance Module — useAttendance Hook
 *
 * Encapsulates state management for the paginated Attendance directory:
 * - Query parameter assembly (page, limit=10, status, fromDate, toDate, search)
 * - Loading, error, and empty states
 * - Metrics / Summary stats loading and synchronization
 * - Date range validation (fromDate <= toDate)
 * - Automatic page reset when filters change
 * - Refresh coordination after marking attendance
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AttendanceListResponse,
  AttendancePaginationMeta,
  AttendanceRecord,
  AttendanceStats,
  AttendanceStatus,
} from "../types/attendance.types";
import {
  getAttendance,
  getAttendanceSummary,
  mapAttendanceError,
} from "../services/attendance.service";
import { convertYmdToDdMmYyyy } from "../utils/attendanceDate.utils";
import { validateDateRange } from "../validation/attendance.validation";

export interface UseAttendanceReturn {
  attendances: AttendanceRecord[] | null;
  pagination: AttendancePaginationMeta | null;
  stats: AttendanceStats | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  currentPage: number;
  statusFilter: AttendanceStatus | "";
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  studentSearch: string;
  dateRangeError: string | null;
  setCurrentPage: (page: number) => void;
  setStatusFilter: (status: AttendanceStatus | "") => void;
  setFromDate: (dateYmd: string) => void;
  setToDate: (dateYmd: string) => void;
  setStudentSearch: (query: string) => void;
  refreshAttendances: () => Promise<void>;
  resetFilters: () => void;
}

export const useAttendance = (): UseAttendanceReturn => {
  const [attendances, setAttendances] = useState<AttendanceRecord[] | null>(null);
  const [pagination, setPagination] = useState<AttendancePaginationMeta | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  // Filter & Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const isInitialMount = useRef(true);

  // Debounce student search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(studentSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [studentSearch]);

  // Validate date range whenever fromDate or toDate changes
  useEffect(() => {
    const rangeCheck = validateDateRange(fromDate, toDate);
    if (!rangeCheck.isValid) {
      setDateRangeError(rangeCheck.error || "Invalid date range");
    } else {
      setDateRangeError(null);
    }
  }, [fromDate, toDate]);

  // Reset page to 1 when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [statusFilter, fromDate, toDate, debouncedSearch]);

  // Fetch Stats function
  const fetchStats = useCallback(async () => {
    // If date range is invalid, skip stats query
    if (fromDate && toDate && fromDate > toDate) return;

    setStatsLoading(true);
    try {
      const formattedFrom = fromDate ? convertYmdToDdMmYyyy(fromDate) : undefined;
      const formattedTo = toDate ? convertYmdToDdMmYyyy(toDate) : undefined;

      const statsData = await getAttendanceSummary({
        fromDate: formattedFrom,
        toDate: formattedTo,
      });
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load attendance summary stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [fromDate, toDate]);

  // Main Fetch function
  const fetchAttendances = useCallback(async () => {
    // Prevent fetching if invalid date range
    if (fromDate && toDate && fromDate > toDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedFrom = fromDate ? convertYmdToDdMmYyyy(fromDate) : undefined;
      const formattedTo = toDate ? convertYmdToDdMmYyyy(toDate) : undefined;

      const response: AttendanceListResponse = await getAttendance({
        page: currentPage,
        limit: 10,
        status: statusFilter ? statusFilter : undefined,
        fromDate: formattedFrom,
        toDate: formattedTo,
      });

      let records = response.attendances || [];

      // If client-side search query is active, filter matching student names / IDs
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        records = records.filter((r) => {
          const user = r.student?.user;
          const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.toLowerCase();
          const email = (user?.email || "").toLowerCase();
          const studentId = (r.studentId || "").toLowerCase();
          return fullName.includes(q) || email.includes(q) || studentId.includes(q);
        });
      }

      setAttendances(records);
      setPagination(response.pagination || null);
    } catch (err: unknown) {
      console.error("Error fetching attendances:", err);
      const friendlyMessage = mapAttendanceError(err);
      setError(friendlyMessage);
      setAttendances(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, fromDate, toDate, debouncedSearch]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refreshAttendances = async () => {
    await Promise.all([fetchAttendances(), fetchStats()]);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setStudentSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
    setDateRangeError(null);
  };

  const isEmpty = !loading && (!attendances || attendances.length === 0);

  return {
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
  };
};
