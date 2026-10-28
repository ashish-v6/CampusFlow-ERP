/**
 * CampusFlow Attendance Module — Attendance API Service
 *
 * Centralized service communicating with /api/attendance endpoints
 * using the configured application Axios client.
 */

import { AxiosError } from "axios";
import api from "../../../api/axios";
import {
  AttendanceListResponse,
  AttendanceQueryDto,
  AttendanceRecord,
  AttendanceStats,
  BulkMarkAttendanceDto,
  MarkAttendanceDto,
  StudentAttendanceResponse,
} from "../types/attendance.types";

/**
 * Creates an individual student attendance record.
 * Endpoint: POST /api/attendance
 */
export const createAttendance = async (
  data: MarkAttendanceDto,
): Promise<{ result: AttendanceRecord }> => {
  const payload: MarkAttendanceDto = {
    studentId: data.studentId.trim(),
    date: data.date.trim(),
    status: data.status,
  };

  const response = await api.post<{ result: AttendanceRecord }>(
    "/api/attendance",
    payload,
  );
  return response.data;
};

// Backwards-compatible alias
export const markStudentAttendance = createAttendance;

/**
 * Creates multiple attendance records atomically.
 * Endpoint: POST /api/attendance/bulk
 */
export const bulkCreateAttendance = async (
  data: BulkMarkAttendanceDto,
): Promise<{ message: string; count: number }> => {
  const payload: BulkMarkAttendanceDto = {
    date: data.date.trim(),
    records: data.records.map((r) => ({
      studentId: r.studentId.trim(),
      status: r.status,
    })),
  };

  const response = await api.post<{ message: string; count: number }>(
    "/api/attendance/bulk",
    payload,
  );
  return response.data;
};

// Backwards-compatible alias
export const markBulkAttendance = bulkCreateAttendance;

/**
 * Fetches paginated attendance records with server-side filtering.
 * Endpoint: GET /api/attendance
 */
export const getAttendance = async (
  query: AttendanceQueryDto = {},
): Promise<AttendanceListResponse> => {
  const cleanParams: Record<string, string | number> = {
    page: query.page && query.page > 0 ? query.page : 1,
    limit: query.limit || 10,
  };

  if (query.studentId && query.studentId.trim()) {
    cleanParams.studentId = query.studentId.trim();
  }
  if (query.status && query.status.trim()) {
    cleanParams.status = query.status.trim();
  }
  if (query.date && query.date.trim()) {
    cleanParams.date = query.date.trim();
  }
  if (query.fromDate && query.fromDate.trim()) {
    cleanParams.fromDate = query.fromDate.trim();
  }
  if (query.toDate && query.toDate.trim()) {
    cleanParams.toDate = query.toDate.trim();
  }

  const response = await api.get<AttendanceListResponse>("/api/attendance", {
    params: cleanParams,
  });

  return response.data;
};

// Backwards-compatible alias
export const getAttendances = getAttendance;

/**
 * Retrieves a single attendance record by primary key UUID.
 * Endpoint: GET /api/attendance/:id
 */
export const getAttendanceById = async (
  id: string,
): Promise<AttendanceRecord> => {
  const response = await api.get<AttendanceRecord>(`/api/attendance/${id.trim()}`);
  return response.data;
};

/**
 * Updates / corrects an existing attendance record's status.
 * Endpoint: PATCH /api/attendance/:id
 */
export const updateAttendance = async (
  id: string,
  data: { status: "PRESENT" | "ABSENT" },
): Promise<AttendanceRecord> => {
  const response = await api.patch<AttendanceRecord>(
    `/api/attendance/${id.trim()}`,
    { status: data.status },
  );
  return response.data;
};

/**
 * Fetches summary statistics for the attendance module.
 * Endpoint: GET /api/attendance/summary
 */
export const getAttendanceSummary = async (
  query: AttendanceQueryDto = {},
): Promise<AttendanceStats> => {
  const cleanParams: Record<string, string> = {};

  if (query.studentId && query.studentId.trim()) {
    cleanParams.studentId = query.studentId.trim();
  }
  if (query.date && query.date.trim()) {
    cleanParams.date = query.date.trim();
  }
  if (query.fromDate && query.fromDate.trim()) {
    cleanParams.fromDate = query.fromDate.trim();
  }
  if (query.toDate && query.toDate.trim()) {
    cleanParams.toDate = query.toDate.trim();
  }

  const response = await api.get<{
    total: number;
    present: number;
    absent: number;
    percentage: number;
    totalStudents: number;
    result?: AttendanceStats;
  }>("/api/attendance/summary", {
    params: cleanParams,
  });

  const data = response.data;
  return {
    totalStudents: data.totalStudents ?? data.result?.totalStudents ?? 0,
    present: data.present ?? data.result?.present ?? 0,
    absent: data.absent ?? data.result?.absent ?? 0,
    totalMarked: data.total ?? data.result?.totalMarked ?? 0,
    percentage: data.percentage ?? data.result?.percentage ?? 0,
  };
};

// Backwards-compatible alias
export const getAttendanceStats = getAttendanceSummary;

/**
 * Retrieves the authenticated student's own attendance records and personal summary.
 * Endpoint: GET /api/attendance/me
 */
export const getMyAttendance = async (
  query: AttendanceQueryDto = {},
): Promise<StudentAttendanceResponse> => {
  const cleanParams: Record<string, string | number> = {
    page: query.page && query.page > 0 ? query.page : 1,
    limit: query.limit || 10,
  };

  if (query.status && query.status.trim()) {
    cleanParams.status = query.status.trim();
  }
  if (query.fromDate && query.fromDate.trim()) {
    cleanParams.fromDate = query.fromDate.trim();
  }
  if (query.toDate && query.toDate.trim()) {
    cleanParams.toDate = query.toDate.trim();
  }

  const response = await api.get<StudentAttendanceResponse>(
    "/api/attendance/me",
    {
      params: cleanParams,
    },
  );

  return response.data;
};

/**
 * Maps Axios errors and server responses to user-friendly messages.
 * Prevents technical stack traces or database errors from leaking to users.
 */
export const mapAttendanceError = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const data = err.response?.data as { message?: string } | undefined;
    const msg = data?.message;

    switch (status) {
      case 400: {
        if (
          typeof msg === "string" &&
          !msg.toLowerCase().includes("prisma") &&
          !msg.toLowerCase().includes("internal")
        ) {
          return msg;
        }
        return "Invalid attendance data. Please check all required fields.";
      }
      case 401:
        return "Your session has expired. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return typeof msg === "string" ? msg : "Student or attendance record not found.";
      case 409:
        if (typeof msg === "string" && msg.includes("already")) {
          return msg;
        }
        return "Attendance has already been marked for this student on this date.";
      case 422:
        return (
          typeof msg === "string"
            ? msg
            : "Attendance cannot be recorded for an inactive student."
        );
      case 500:
      case 502:
      case 503:
        return "A server error occurred. Please try again later.";
      default:
        if (!err.response) {
          return "Unable to connect to the server. Please check your internet connection.";
        }
        return (
          msg ||
          "An error occurred while saving attendance. Please try again."
        );
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return "An unexpected error occurred. Please try again.";
};
