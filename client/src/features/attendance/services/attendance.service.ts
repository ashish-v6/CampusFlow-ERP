/**
 * CampusFlow Attendance Module — Service Layer
 * 
 * Manages API requests for attendance records, marking, updates, summaries, and overviews
 * using the existing centralized Axios instance.
 */

import api from "../../../api/axios";
import {
  AttendanceListResponse,
  AttendanceQueryDto,
  AttendanceRecord,
  BulkMarkAttendanceDto,
  DepartmentAttendanceOverview,
  MarkAttendanceDto,
  StudentAttendanceSummary,
  UpdateAttendanceDto,
} from "../types/attendance.types";

/**
 * Fetches paginated attendance records with optional filtering.
 * Backend: GET /api/attendance
 */
export const getAttendances = async (
  query?: AttendanceQueryDto,
): Promise<AttendanceListResponse> => {
  const params: Record<string, string | number> = {};

  if (query?.page) params.page = query.page;
  if (query?.limit) params.limit = query.limit;
  if (query?.studentId) params.studentId = query.studentId;
  if (query?.facultyId) params.facultyId = query.facultyId;
  if (query?.departmentId) params.departmentId = query.departmentId;
  if (query?.programId) params.programId = query.programId;
  if (query?.date) params.date = query.date;
  if (query?.startDate) params.startDate = query.startDate;
  if (query?.endDate) params.endDate = query.endDate;
  if (query?.status) params.status = query.status;
  if (query?.search && query.search.trim()) params.search = query.search.trim();

  const response = await api.get<AttendanceListResponse>("/api/attendance", { params });
  return response.data;
};

/**
 * Fetches a single attendance record by ID.
 * Backend: GET /api/attendance/:id
 */
export const getAttendanceById = async (id: string): Promise<AttendanceRecord> => {
  const response = await api.get<AttendanceRecord>(`/api/attendance/${id}`);
  return response.data;
};

/**
 * Marks attendance for a single student.
 * Backend: POST /api/attendance
 */
export const markAttendance = async (data: MarkAttendanceDto): Promise<AttendanceRecord> => {
  const response = await api.post<AttendanceRecord>("/api/attendance", data);
  return response.data;
};

/**
 * Marks bulk attendance for multiple students in an atomic transaction.
 * Backend: POST /api/attendance/bulk
 */
export const bulkMarkAttendance = async (
  data: BulkMarkAttendanceDto,
): Promise<{
  count: number;
  date: string;
  attendances: AttendanceRecord[];
}> => {
  const response = await api.post<{
    count: number;
    date: string;
    attendances: AttendanceRecord[];
  }>("/api/attendance/bulk", data);
  return response.data;
};

/**
 * Updates an existing attendance record.
 * Backend: PATCH /api/attendance/:id
 */
export const updateAttendance = async (
  id: string,
  data: UpdateAttendanceDto,
): Promise<AttendanceRecord> => {
  const response = await api.patch<AttendanceRecord>(`/api/attendance/${id}`, data);
  return response.data;
};

/**
 * Fetches attendance summary for a specific student.
 * Backend: GET /api/attendance/summary/student/:studentId
 */
export const getStudentSummary = async (
  studentId: string,
  params?: { startDate?: string; endDate?: string },
): Promise<StudentAttendanceSummary> => {
  const response = await api.get<StudentAttendanceSummary>(
    `/api/attendance/summary/student/${studentId}`,
    { params },
  );
  return response.data;
};

/**
 * Fetches current student's personal attendance summary.
 * Backend: GET /api/attendance/my-summary
 */
export const getMySummary = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<StudentAttendanceSummary> => {
  const response = await api.get<StudentAttendanceSummary>("/api/attendance/my-summary", {
    params,
  });
  return response.data;
};

/**
 * Fetches aggregate department attendance overview.
 * Backend: GET /api/attendance/overview/department/:departmentId
 */
export const getDepartmentOverview = async (
  departmentId: string,
): Promise<DepartmentAttendanceOverview> => {
  const response = await api.get<DepartmentAttendanceOverview>(
    `/api/attendance/overview/department/${departmentId}`,
  );
  return response.data;
};
