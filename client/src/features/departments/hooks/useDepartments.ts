/**
 * CampusFlow Department Module — useDepartments Hook
 * 
 * Encapsulates the complete state management for the paginated Department directory:
 * - Query parameter assembly (page, limit, search, status)
 * - Debouncing search input to reduce API calls (300ms)
 * - Loading, error, and empty state tracking
 * - Automatic page reset when filters change
 * - Dashboard stats loading & synchronization
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getDepartments, getDepartmentStats } from "../services/department.service";
import {
  Department,
  DepartmentPaginationMeta,
  DepartmentStatus,
  DepartmentStats,
} from "../types/department.types";

export interface UseDepartmentsReturn {
  departments: Department[] | null;
  pagination: DepartmentPaginationMeta | null;
  stats: DepartmentStats | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  currentPage: number;
  searchQuery: string;
  statusFilter: DepartmentStatus | "";
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: DepartmentStatus | "") => void;
  refreshDepartments: () => Promise<void>;
  resetFilters: () => void;
}

export const useDepartments = (initialLimit: number = 10): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [pagination, setPagination] = useState<DepartmentPaginationMeta | null>(null);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<DepartmentStatus | "">("");

  const isInitialMount = useRef(true);

  // 1. Debounce Search Input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Reset page to 1 whenever filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // 3. Main Fetch function
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDepartments({
        page: currentPage,
        limit: initialLimit,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter ? statusFilter : undefined,
      });

      setDepartments(response.departments);
      setPagination(response.pagination);
    } catch (err: unknown) {
      console.error("Error fetching departments:", err);
      setError("Unable to load department records. Please try again.");
      setDepartments(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, debouncedSearch, statusFilter]);

  // 4. Load Department aggregate stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getDepartmentStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load department stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const refreshDepartments = async () => {
    await Promise.all([fetchDepartments(), fetchStats()]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const isEmpty = !loading && (!departments || departments.length === 0);

  return {
    departments,
    pagination,
    stats,
    loading,
    error,
    isEmpty,
    currentPage,
    searchQuery,
    statusFilter,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    refreshDepartments,
    resetFilters,
  };
};
