/**
 * CampusFlow Department Module — useDepartmentDetails Hook
 * 
 * Fetches and maintains state for a single department record.
 * Handles loading, error states, and cache invalidation/refresh after edits.
 */

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getDepartmentById } from "../services/department.service";
import { Department } from "../types/department.types";

export interface UseDepartmentDetailsReturn {
  department: Department | null;
  loading: boolean;
  error: string | null;
  refreshDepartment: () => Promise<void>;
}

export const useDepartmentDetails = (
  departmentId: string | undefined,
): UseDepartmentDetailsReturn => {
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartment = useCallback(async () => {
    if (!departmentId) {
      setError("No department ID specified");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getDepartmentById(departmentId);
      setDepartment(data);
    } catch (err: unknown) {
      console.error("Failed to load department details:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          setError(err.response?.data?.message || "Department record not found");
        } else if (err.response?.status === 403) {
          setError(err.response?.data?.message || "Not authorized to view this department profile");
        } else if (err.response?.status === 401) {
          setError("Authentication required to view this department profile");
        } else {
          setError(err.response?.data?.message || "Unable to load department information");
        }
      } else {
        setError("Unable to load department information");
      }
      setDepartment(null);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  return {
    department,
    loading,
    error,
    refreshDepartment: fetchDepartment,
  };
};
