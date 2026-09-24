/**
 * CampusFlow Dashboard Module — useDashboard Hook
 */

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { DashboardData, DashboardQueryDto } from "../types/dashboard.types";
import { getDashboardData } from "../services/dashboard.service";
import { getDepartments } from "../../departments/services/department.service";
import { Department } from "../../departments/types/department.types";

export interface UseDashboardReturn {
  data: DashboardData | null;
  departments: Department[];
  loading: boolean;
  error: string | null;
  departmentFilter: string;
  startDate: string;
  endDate: string;
  setDepartmentFilter: (deptId: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  refreshDashboard: () => Promise<void>;
  resetFilters: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // 1. Fetch departments for dropdown
  useEffect(() => {
    let isMounted = true;
    getDepartments({ limit: 100 })
      .then((res) => {
        if (isMounted) {
          setDepartments(res.departments.filter((d) => d.status === "ACTIVE"));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch departments for dashboard filter:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch dashboard data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query: DashboardQueryDto = {};
      if (departmentFilter) query.departmentId = departmentFilter;
      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;

      const result = await getDashboardData(query);
      setData(result);
    } catch (err: unknown) {
      console.error("Failed to load dashboard data:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to load ERP dashboard metrics. Please try again.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [departmentFilter, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetFilters = () => {
    setDepartmentFilter("");
    setStartDate("");
    setEndDate("");
  };

  return {
    data,
    departments,
    loading,
    error,
    departmentFilter,
    startDate,
    endDate,
    setDepartmentFilter,
    setStartDate,
    setEndDate,
    refreshDashboard: fetchData,
    resetFilters,
  };
};
