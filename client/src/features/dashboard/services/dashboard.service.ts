/**
 * CampusFlow Dashboard Module — API Service
 * 
 * Manages HTTP communication with the dashboard backend endpoint
 * using the existing centralized Axios instance.
 */

import api from "../../../api/axios";
import { DashboardData, DashboardQueryDto } from "../types/dashboard.types";

/**
 * Fetches dashboard overview metrics according to logged-in user's role and optional filters.
 * Backend: GET /api/dashboard
 */
export const getDashboardData = async (
  query?: DashboardQueryDto,
): Promise<DashboardData> => {
  const params: Record<string, string> = {};

  if (query?.startDate) params.startDate = query.startDate;
  if (query?.endDate) params.endDate = query.endDate;
  if (query?.departmentId) params.departmentId = query.departmentId;

  const response = await api.get<DashboardData>("/api/dashboard", { params });
  return response.data;
};
