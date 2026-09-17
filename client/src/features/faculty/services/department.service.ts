/**
 * CampusFlow Faculty Module — Department Service
 * 
 * Fetches department records from the backend API (GET /api/departments).
 */

import api from "../../../api/axios";
import { Department } from "../types/faculty.types";

interface DepartmentApiResponse {
  departments?: Department[];
  result?: Department[];
  data?: Department[];
}

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await api.get<DepartmentApiResponse | Department[]>("/api/departments");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    const data = response.data as DepartmentApiResponse;
    if (data && Array.isArray(data.departments)) {
      return data.departments;
    }
    if (data && Array.isArray(data.result)) {
      return data.result;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
};
