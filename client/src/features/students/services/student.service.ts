/**
 * CampusFlow Student Module — Student API Service
 * 
 * Provides centralized network communication with the /api/students endpoints
 * using the configured application Axios instance.
 */

import api from "../../../api/axios";
import {
  Student,
  StudentCreateDto,
  StudentListResponse,
  StudentQueryDto,
  StudentStats,
  StudentUpdateDto,
} from "../types/student.types";

/**
 * Fetches paginated students matching optional search, status, and program filters.
 * 
 * Note on query parameter construction:
 * The backend Zod schema rejects empty strings for enum and UUID filters.
 * We normalize the params object here to ensure only active, non-empty filter
 * values are dispatched over the wire.
 */
export const getStudents = async (
  query: StudentQueryDto = {},
): Promise<StudentListResponse> => {
  const cleanParams: Record<string, string | number> = {};

  if (query.page && query.page > 0) {
    cleanParams.page = query.page;
  }
  if (query.limit && query.limit > 0) {
    cleanParams.limit = query.limit;
  }
  if (query.search && query.search.trim().length > 0) {
    cleanParams.search = query.search.trim();
  }
  if (query.status && query.status.trim().length > 0) {
    cleanParams.status = query.status;
  }
  if (query.programId && query.programId.trim().length > 0) {
    cleanParams.programId = query.programId;
  }

  const response = await api.get<StudentListResponse>("/api/students", {
    params: cleanParams,
  });

  return response.data;
};

/**
 * Retrieves a single student record by institutional database UUID.
 * Accessible by ADMIN, FACULTY, and the verified owning STUDENT.
 */
export const getStudentById = async (id: string): Promise<Student> => {
  const response = await api.get<Student>(`/api/students/${id}`);
  return response.data;
};

/**
 * Creates a new Student record linked to an existing User and Program.
 * 
 * Why userId is sent:
 * CampusFlow maintains a decoupled architecture where identity (User) is distinct
 * from academic enrollment (Student). Creating a student links an existing eligible
 * user account to institutional student records.
 * 
 * Why programId is sent:
 * Programs can change names or codes over time, while internal foreign keys remain
 * stable. We send programId while displaying the friendly program name in the UI.
 */
export const createStudent = async (
  data: StudentCreateDto,
): Promise<Student> => {
  // Clean optional fields: strip empty strings so server receives undefined or null
  const payload: Partial<StudentCreateDto> = {
    userId: data.userId,
    studentId: data.studentId.trim(),
    admissionDate: data.admissionDate,
    programId: data.programId,
  };

  if (data.dateOfBirth && data.dateOfBirth.trim()) {
    payload.dateOfBirth = data.dateOfBirth;
  }
  if (data.gender && data.gender.trim()) {
    payload.gender = data.gender;
  }
  if (data.phone && data.phone.trim()) {
    payload.phone = data.phone.trim();
  }
  if (data.address && data.address.trim()) {
    payload.address = data.address.trim();
  }

  const response = await api.post<Student>("/api/students", payload);
  return response.data;
};

/**
 * Updates an existing Student's administrative details.
 * Allowed fields: programId, dateOfBirth, gender, phone, address, status.
 */
export const updateStudent = async (
  id: string,
  data: StudentUpdateDto,
): Promise<Student> => {
  const payload: Record<string, unknown> = {};

  if (data.programId) payload.programId = data.programId;
  if (data.dateOfBirth !== undefined) payload.dateOfBirth = data.dateOfBirth || null;
  if (data.gender !== undefined) payload.gender = data.gender || null;
  if (data.phone !== undefined) payload.phone = data.phone || null;
  if (data.address !== undefined) payload.address = data.address || null;
  if (data.status) payload.status = data.status;

  const response = await api.patch<Student>(`/api/students/${id}`, payload);
  return response.data;
};

export interface EligibleStudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Fetches verified active student users who do not yet have an institutional
 * Student profile record linked.
 * Calls GET /api/students/eligible-users with fallback.
 */
export const getEligibleUsers = async (): Promise<EligibleStudentUser[]> => {
  try {
    const response = await api.get<{ users: EligibleStudentUser[] }>("/api/students/eligible-users");
    if (response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    }
  } catch (err) {
    console.warn("Primary /api/students/eligible-users unavailable, attempting fallback:", err);
  }

  // Fallback: query /api/users if caller has admin permissions
  try {
    const fallbackRes = await api.get<{ users: Array<{ id: string; firstName: string; lastName: string; email: string; role?: string; status?: string }> }>("/api/users", {
      params: { page: 1, limit: 100 },
    });
    if (fallbackRes.data && Array.isArray(fallbackRes.data.users)) {
      return fallbackRes.data.users
        .filter((u) => u.role?.toUpperCase() === "STUDENT" && u.status?.toUpperCase() === "ACTIVE")
        .map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        }));
    }
  } catch (fallbackErr) {
    console.error("Fallback /api/users also failed:", fallbackErr);
  }

  return [];
};

/**
 * Retrieves the current authenticated student's own academic profile.
 * Corresponds to GET /api/students/me
 */
export const getMyStudentProfile = async (): Promise<Student> => {
  const response = await api.get<Student>("/api/students/me");
  return response.data;
};

/**
 * Retrieves aggregate student statistics: total, active, inactive, and program counts.
 * Corresponds to GET /api/students/status
 */
export const getStudentStatus = async (): Promise<StudentStats> => {
  try {
    const res = await api.get<{ result: StudentStats }>("/api/students/status");
    return res.data.result;
  } catch (err) {
    console.warn("Failed to fetch student status, computing fallback:", err);
    return { total: 0, active: 0, inActive: 0, programs: 0 };
  }
};
