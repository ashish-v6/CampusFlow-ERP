/**
 * CampusFlow Attendance Module — useAttendance Hook
 * 
 * Manages state for attendance directory, date picker, filtering, pagination,
 * search debouncing, and list refreshing.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getAttendances } from "../services/attendance.service";
import { getDepartments } from "../../departments/services/department.service";
import { Department } from "../../departments/types/department.types";
import {
  AttendancePaginationMeta,
  AttendanceRecord,
  AttendanceStatus,
} from "../types/attendance.types";
import { getTodayDateString } from "../utils/attendanceBadgeStyles";

export interface UseAttendanceReturn {
  attendances: AttendanceRecord[] | null;
  pagination: AttendancePaginationMeta | null;
  departments: Department[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  // Filters & State
  selectedDate: string;
  departmentFilter: string;
  statusFilter: AttendanceStatus | "";
  searchQuery: string;
  currentPage: number;
  // Setters
  setSelectedDate: (date: string) => void;
  setDepartmentFilter: (deptId: string) => void;
  setStatusFilter: (status: AttendanceStatus | "") => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  refreshAttendances: () => Promise<void>;
  resetFilters: () => void;
}

export const useAttendance = (initialLimit: number = 10): UseAttendanceReturn => {
  const [attendances, setAttendances] = useState<AttendanceRecord[] | null>(null);
  const [pagination, setPagination] = useState<AttendancePaginationMeta | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "">("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isInitialMount = useRef(true);

  // 1. Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch departments for dropdown
  useEffect(() => {
    let isMounted = true;
    getDepartments({ limit: 100 })
      .then((res) => {
        if (isMounted) {
          setDepartments(res.departments.filter((d) => d.status === "ACTIVE"));
        }
      })
      .catch((err) => {
        console.error("Failed to load departments for attendance filter:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Reset page to 1 whenever filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [selectedDate, departmentFilter, statusFilter, debouncedSearch]);

  // 4. Fetch attendances based on current filters
  const fetchAttendances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAttendances({
        page: currentPage,
        limit: initialLimit,
        date: selectedDate || undefined,
        departmentId: departmentFilter || undefined,
        status: statusFilter || undefined,
        search: debouncedSearch.trim() || undefined,
      });

      setAttendances(response.attendances);
      setPagination(response.pagination);
    } catch (err: unknown) {
      console.error("Failed to fetch attendances:", err);
      setError("Unable to load attendance records. Please try again.");
      setAttendances(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, selectedDate, departmentFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const refreshAttendances = async () => {
    await fetchAttendances();
  };

  const resetFilters = () => {
    setSelectedDate(getTodayDateString());
    setDepartmentFilter("");
    setStatusFilter("");
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const isEmpty = !loading && (!attendances || attendances.length === 0);

  return {
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
  };
};
