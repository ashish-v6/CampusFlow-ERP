/**
 * CampusFlow Department Module — Department Service
 * 
 * Manages API requests for department retrieval, creation, updates, and metrics
 * using existing backend endpoints.
 */

import api from "../../../api/axios";
import {
  Department,
  DepartmentCreateDto,
  DepartmentListResponse,
  DepartmentQueryDto,
  DepartmentStats,
  DepartmentUpdateDto,
} from "../types/department.types";

/**
 * Fetches paginated list of departments with optional filtering and search.
 * Backend endpoint: GET /api/departments
 */
export const getDepartments = async (
  query?: DepartmentQueryDto,
): Promise<DepartmentListResponse> => {
  const params: Record<string, string | number> = {};

  if (query?.page) params.page = query.page;
  if (query?.limit) params.limit = query.limit;
  if (query?.search && query.search.trim()) params.search = query.search.trim();
  if (query?.status) params.status = query.status;

  const response = await api.get<DepartmentListResponse>("/api/departments", { params });
  return response.data;
};

/**
 * Fetches a single department record by UUID.
 * Backend endpoint: GET /api/departments/:id
 */
export const getDepartmentById = async (id: string): Promise<Department> => {
  const response = await api.get<Department>(`/api/departments/${id}`);
  return response.data;
};

/**
 * Creates a new Department.
 * Backend endpoint: POST /api/departments
 */
export const createDepartment = async (
  data: DepartmentCreateDto,
): Promise<Department> => {
  const payload = {
    name: data.name.trim(),
    code: data.code.trim(),
  };

  const response = await api.post<Department>("/api/departments", payload);
  return response.data;
};

/**
 * Updates an existing Department.
 * Backend endpoint: PATCH /api/departments/:id
 */
export const updateDepartment = async (
  id: string,
  data: DepartmentUpdateDto,
): Promise<Department> => {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim();
  if (data.status !== undefined) payload.status = data.status;

  const response = await api.patch<Department>(`/api/departments/${id}`, payload);
  return response.data;
};

/**
 * Computes summary metrics for department dashboard cards using existing pagination metadata.
 */
export const getDepartmentStats = async (): Promise<DepartmentStats> => {
  try {
    const [allRes, activeRes, inactiveRes] = await Promise.all([
      api.get<DepartmentListResponse>("/api/departments", { params: { page: 1, limit: 1 } }),
      api.get<DepartmentListResponse>("/api/departments", {
        params: { page: 1, limit: 1, status: "ACTIVE" },
      }),
      api.get<DepartmentListResponse>("/api/departments", {
        params: { page: 1, limit: 1, status: "INACTIVE" },
      }),
    ]);

    return {
      total: allRes.data.pagination?.total ?? 0,
      active: activeRes.data.pagination?.total ?? 0,
      inActive: inactiveRes.data.pagination?.total ?? 0,
    };
  } catch (err) {
    console.warn("Failed to compute department stats:", err);
    return {
      total: 0,
      active: 0,
      inActive: 0,
    };
  }
};
