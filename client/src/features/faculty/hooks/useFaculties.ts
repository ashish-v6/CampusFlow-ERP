/**
 * CampusFlow Faculty Module — useFaculties Hook
 * 
 * Encapsulates the complete state management for the paginated Faculty directory:
 * - Query parameter assembly (page, limit, search, status, department)
 * - Debouncing search input to reduce API calls
 * - Loading, error, and empty state tracking
 * - Automatic page reset when filters change
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getFaculties, getFacultyStats } from "../services/faculty.service";
import { getDepartments } from "../services/department.service";
import {
  Faculty,
  FacultyPaginationMeta,
  FacultyStatus,
  FacultyStats,
  Department,
} from "../types/faculty.types";

export interface UseFacultiesReturn {
  faculties: Faculty[] | null;
  pagination: FacultyPaginationMeta | null;
  departments: Department[];
  stats: FacultyStats | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  currentPage: number;
  searchQuery: string;
  statusFilter: FacultyStatus | "";
  departmentFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: FacultyStatus | "") => void;
  setDepartmentFilter: (departmentId: string) => void;
  refreshFaculties: () => Promise<void>;
  resetFilters: () => void;
}

export const useFaculties = (initialLimit: number = 10): UseFacultiesReturn => {
  const [faculties, setFaculties] = useState<Faculty[] | null>(null);
  const [pagination, setPagination] = useState<FacultyPaginationMeta | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<FacultyStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<FacultyStatus | "">("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const isInitialMount = useRef(true);

  // 1. Debounce Search Input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Load Departments on mount for filter dropdown
  useEffect(() => {
    let isMounted = true;
    getDepartments()
      .then((data) => {
        if (isMounted) setDepartments(data);
      })
      .catch((err) => {
        console.error("Failed to load departments for filter:", err);
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
  }, [debouncedSearch, statusFilter, departmentFilter]);

  // 4. Main Fetch function
  const fetchFaculties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFaculties({
        page: currentPage,
        limit: initialLimit,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter ? statusFilter : undefined,
        departmentId: departmentFilter ? departmentFilter : undefined,
      });

      setFaculties(response.faculties);
      setPagination(response.pagination);
    } catch (err: unknown) {
      console.error("Error fetching faculties:", err);
      setError("Unable to load faculty records. Please try again.");
      setFaculties(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, debouncedSearch, statusFilter, departmentFilter]);

  // Load Faculty aggregate stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getFacultyStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load faculty stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  const refreshFaculties = async () => {
    await Promise.all([fetchFaculties(), fetchStats()]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("");
    setDepartmentFilter("");
    setCurrentPage(1);
  };

  const isEmpty = !loading && (!faculties || faculties.length === 0);

  return {
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
  };
};
