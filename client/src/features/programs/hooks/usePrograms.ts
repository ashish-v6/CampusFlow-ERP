/**
 * CampusFlow Academic Program Module — usePrograms Hook
 * 
 * Encapsulates state management for the paginated Programs directory:
 * - Query parameter assembly (page, limit, search, departmentId, status)
 * - Search debouncing (300ms)
 * - Loading, error, and empty state tracking
 * - Automatic page reset when filters change
 * - Program stats & department options synchronization
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getPrograms, getProgramStats } from "../services/program.service";
import { getDepartments } from "../../departments/services/department.service";
import {
  Program,
  ProgramPaginationMeta,
  ProgramStatus,
  ProgramStats,
} from "../types/program.types";
import { Department } from "../../departments/types/department.types";

export interface UseProgramsReturn {
  programs: Program[] | null;
  pagination: ProgramPaginationMeta | null;
  departments: Department[];
  stats: ProgramStats | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  currentPage: number;
  searchQuery: string;
  departmentFilter: string;
  statusFilter: ProgramStatus | "";
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (deptId: string) => void;
  setStatusFilter: (status: ProgramStatus | "") => void;
  refreshPrograms: () => Promise<void>;
  resetFilters: () => void;
}

export const usePrograms = (initialLimit: number = 10): UseProgramsReturn => {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [pagination, setPagination] = useState<ProgramPaginationMeta | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | "">("");

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
  }, [debouncedSearch, departmentFilter, statusFilter]);

  // 3. Main Fetch Programs
  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPrograms({
        page: currentPage,
        limit: initialLimit,
        search: debouncedSearch.trim() || undefined,
        departmentId: departmentFilter || undefined,
        status: statusFilter || undefined,
      });

      setPrograms(response.programs);
      setPagination(response.pagination);
    } catch (err: unknown) {
      console.error("Error fetching programs:", err);
      setError("Unable to load academic program records. Please try again.");
      setPrograms(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit, debouncedSearch, departmentFilter, statusFilter]);

  // 4. Fetch Departments list for filtering & form selects
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await getDepartments({ page: 1, limit: 100 });
      setDepartments(res.departments);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  }, []);

  // 5. Fetch Program Stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getProgramStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load program stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, [fetchDepartments, fetchStats]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const refreshPrograms = async () => {
    await Promise.all([fetchPrograms(), fetchStats()]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const isEmpty = !loading && (!programs || programs.length === 0);

  return {
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
  };
};
