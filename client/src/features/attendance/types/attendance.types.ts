/**
 * CampusFlow Attendance Module — Type Definitions
 *
 * Types for individual and bulk attendance records, creation payloads,
 * queries, statistics, and paginated responses.
 */

export type AttendanceStatus = "PRESENT" | "ABSENT";

export interface AttendanceStudentUser {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export interface AttendanceStudent {
  user: AttendanceStudentUser;
}

/**
 * Attendance entity returned by backend
 */
export interface AttendanceRecord {
  id: string;
  studentId: string;
  student?: AttendanceStudent;
  date: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload sent to POST /api/attendance
 * Note: date must strictly be "DD-MM-YYYY"
 */
export interface MarkAttendanceDto {
  studentId: string;
  date: string; // DD-MM-YYYY
  status: AttendanceStatus;
}

/**
 * Payload item for bulk attendance
 */
export interface BulkAttendanceItem {
  studentId: string;
  status: AttendanceStatus;
}

/**
 * Payload sent to POST /api/attendance/bulk
 */
export interface BulkMarkAttendanceDto {
  date: string; // DD-MM-YYYY
  records: BulkAttendanceItem[];
}

/**
 * Query parameters supported by GET /api/attendance and GET /api/attendance/me
 */
export interface AttendanceQueryDto {
  page?: number;
  limit?: number;
  studentId?: string;
  status?: AttendanceStatus;
  date?: string; // DD-MM-YYYY
  fromDate?: string; // DD-MM-YYYY
  toDate?: string; // DD-MM-YYYY
}

/**
 * Pagination metadata returned by CampusFlow backend
 */
export interface AttendancePaginationMeta {
  totalPages: number;
  total: number;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Response structure for GET /api/attendance
 */
export interface AttendanceListResponse {
  attendances: AttendanceRecord[];
  pagination: AttendancePaginationMeta;
}

/**
 * Summary metrics for administrative Attendance view
 */
export interface AttendanceStats {
  totalStudents: number;
  present: number;
  absent: number;
  totalMarked: number;
  percentage: number;
}

/**
 * Summary metrics for Student's own attendance
 */
export interface StudentAttendanceSummary {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

/**
 * Response structure for GET /api/attendance/me
 */
export interface StudentAttendanceResponse {
  attendances: AttendanceRecord[];
  pagination: AttendancePaginationMeta;
  summary: StudentAttendanceSummary;
  student?: {
    id: string;
    studentId: string;
  };
}
