/**
 * CampusFlow Faculty Module — Faculty Service
 * 
 * Manages API requests for faculty retrieval, creation, updates, and metrics.
 * Incorporates a submit-level validation gate ensuring future joining dates are never transmitted.
 */

import api from "../../../api/axios";
import {
  Faculty,
  FacultyCreateDto,
  FacultyListResponse,
  FacultyQueryDto,
  FacultyStats,
  FacultyUpdateDto,
  EligibleFacultyUser,
} from "../types/faculty.types";
import { isFutureDate } from "../utils/facultyBadgeStyles";

/**
 * Fetches paginated list of faculties with optional filtering and search.
 */
export const getFaculties = async (
  query?: FacultyQueryDto,
): Promise<FacultyListResponse> => {
  const params: Record<string, string | number> = {};

  if (query?.page) params.page = query.page;
  if (query?.limit) params.limit = query.limit;
  if (query?.search && query.search.trim()) params.search = query.search.trim();
  if (query?.status) params.status = query.status;
  if (query?.departmentId) params.departmentId = query.departmentId;

  const response = await api.get<FacultyListResponse>("/api/faculties", { params });
  return response.data;
};

/**
 * Fetches a single faculty profile record by UUID.
 */
export const getFacultyById = async (id: string): Promise<Faculty> => {
  const response = await api.get<Faculty>(`/api/faculties/${id}`);
  return response.data;
};

/**
 * Creates a new Faculty institutional profile linked to an existing active User.
 * 
 * Enforces submit-level check: Rejects if joining date is in the future.
 */
export const createFaculty = async (
  data: FacultyCreateDto,
): Promise<Faculty> => {
  // Submit-level check: Reject future dates before API request
  if (isFutureDate(data.joiningDate)) {
    throw new Error("Joining date cannot be in the future.");
  }

  const payload = {
    userId: data.userId,
    facultyId: data.facultyId.trim(),
    departmentId: data.departmentId,
    designation: data.designation.trim(),
    joiningDate: data.joiningDate,
    phone: data.phone.trim(),
  };

  const response = await api.post<Faculty>("/api/faculties", payload);
  return response.data;
};

/**
 * Updates an existing Faculty member's departmental and professional details.
 * 
 * Enforces submit-level check: Rejects if joining date is in the future.
 */
export const updateFaculty = async (
  id: string,
  data: FacultyUpdateDto,
): Promise<Faculty> => {
  if (data.joiningDate && isFutureDate(data.joiningDate)) {
    throw new Error("Joining date cannot be in the future.");
  }

  const payload: Record<string, unknown> = {};

  if (data.departmentId) payload.departmentId = data.departmentId;
  if (data.designation !== undefined) payload.designation = data.designation.trim();
  if (data.joiningDate !== undefined) payload.joiningDate = data.joiningDate;
  if (data.phone !== undefined) payload.phone = data.phone.trim();
  if (data.status) payload.status = data.status;

  const response = await api.patch<Faculty>(`/api/faculties/${id}`, payload);
  return response.data;
};

/**
 * Fetches verified active faculty users who do not yet have an institutional
 * Faculty profile record linked.
 */
export const getEligibleFacultyUsers = async (): Promise<EligibleFacultyUser[]> => {
  try {
    const response = await api.get<{ users: EligibleFacultyUser[] }>("/api/faculties/eligible-users");
    if (response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    }
  } catch (err) {
    console.warn("Primary /api/faculties/eligible-users unavailable, attempting fallback:", err);
  }

  // Fallback: query /api/users if caller has admin permissions
  try {
    const fallbackRes = await api.get<{
      users: Array<{ id: string; firstName: string; lastName: string; email: string; role?: string; status?: string }>;
    }>("/api/users", {
      params: { page: 1, limit: 100 },
    });
    if (fallbackRes.data && Array.isArray(fallbackRes.data.users)) {
      return fallbackRes.data.users
        .filter((u) => u.role?.toUpperCase() === "FACULTY" && u.status?.toUpperCase() === "ACTIVE")
        .map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        }));
    }
  } catch (fallbackErr) {
    console.error("Fallback /api/users query failed:", fallbackErr);
  }

  return [];
};

/**
 * Fetches summary statistics for the Faculty dashboard cards.
 */
export const getFacultyStats = async (): Promise<FacultyStats> => {
  try {
    const response = await api.get<FacultyStats>("/api/faculties/status");
    if (response.data && typeof response.data.total === "number") {
      return response.data;
    }
  } catch (err) {
    console.warn("Could not fetch /api/faculties/status, computing fallback:", err);
  }

  // Fallback: fetch page 1 to compute basic numbers
  try {
    const listRes = await api.get<FacultyListResponse>("/api/faculties", {
      params: { page: 1, limit: 100 },
    });
    const faculties = listRes.data?.faculties || [];
    const total = listRes.data?.pagination?.total ?? faculties.length;
    const active = faculties.filter((f) => f.status === "ACTIVE").length;
    const inActive = faculties.filter((f) => f.status === "INACTIVE").length;
    return {
      total,
      active,
      inActive,
      departments: 0,
    };
  } catch {
    return {
      total: 0,
      active: 0,
      inActive: 0,
      departments: 0,
    };
  }
};
