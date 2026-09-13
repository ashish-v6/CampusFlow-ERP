/**
 * CampusFlow Student Module — useStudents Hook
 * 
 * Encapsulates the complete state management for the paginated Student directory:
 * - Query parameter assembly (page, limit, search, status, program)
 * - Debouncing search input to prevent unnecessary network traffic
 * - Loading, error, and empty state tracking
 * - Automatic page reset when filters change
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getStudents, getStudentStatus } from "../services/student.service";
import { getPrograms } from "../services/program.service";
import {
  Student,
  StudentPaginationMeta,
  StudentStatus,
  StudentStats,
  Program,
} from "../types/student.types";

export interface UseStudentsReturn {
  students: Student[] | null;
  pagination: StudentPaginationMeta | null;
  programs: Program[];
  stats: StudentStats | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  currentPage: number;
  searchQuery: string;
  statusFilter: StudentStatus | "";
  programFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: StudentStatus | "") => void;
  setProgramFilter: (programId: string) => void;
  refreshStudents: () => Promise<void>;
  resetFilters: () => void;
}

export const useStudents = (initialLimit: number = 10): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [pagination, setPagination] = useState<StudentPaginationMeta | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "">("");
  const [programFilter, setProgramFilter] = useState<string>("");

  // Track if this is the first render to avoid premature reset
  const isInitialMount = useRef(true);

  // 1. Debounce Search Input (300ms)
  // Backend searches across studentId, firstName, lastName, and email.
  // Debouncing reduces API calls while typing.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Load Academic Programs once on mount for filter dropdown
  useEffect(() => {
    let isMounted = true;
    getPrograms()
      .then((data) => {
        if (isMounted) setPrograms(data);
      })
      .catch((err) => {
        console.error("Failed to load programs for filter:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Reset page to 1 whenever active filters change
  // When a user narrows down their search, they should see page 1 of the new subset.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, programFilter]);

  // 4. Main Fetch function
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getStudents({
        page: currentPage,
        limit: initialLimit,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter ? statusFilter : undefined,
        programId: programFilter ? programFilter : undefined,
      });

      setStudents(response.students);
      setPagination(response.pagination);
    } catch (err: unknown) {
      console.error("Error fetching students:", err);
      setError("Unable to load student records. Please try again.");
      setStudents(null);
    } finally {
      // Standard CampusFlow lifecycle: always reset loading flag in finally
      setLoading(false);
    }
  }, [currentPage, initialLimit, debouncedSearch, statusFilter, programFilter]);

  // Load Student aggregate stats (total, active, inactive, programs)
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getStudentStatus();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load student status stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Refresh handler for manual reload or post-mutation sync
  const refreshStudents = async () => {
    await Promise.all([fetchStudents(), fetchStats()]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("");
    setProgramFilter("");
    setCurrentPage(1);
  };

  const isEmpty = !loading && (!students || students.length === 0);

  return {
    students,
    pagination,
    programs,
    stats,
    loading,
    error,
    isEmpty,
    currentPage,
    searchQuery,
    statusFilter,
    programFilter,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setProgramFilter,
    refreshStudents,
    resetFilters,
  };
};
