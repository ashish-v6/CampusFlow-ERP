/**
 * CampusFlow Attendance Module — Type Definitions
 */

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  facultyId: string | null;
  date: string;
  status: AttendanceStatus;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    studentId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    program: {
      id: string;
      name: string;
      code: string;
      departmentId: string;
    };
  };
  faculty?: {
    id: string;
    facultyId: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } | null;
}

export interface MarkAttendanceDto {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkMarkAttendanceItemDto {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkMarkAttendanceDto {
  date: string;
  records: BulkMarkAttendanceItemDto[];
}

export interface UpdateAttendanceDto {
  date?: string;
  status?: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceQueryDto {
  page?: number;
  limit?: number;
  studentId?: string;
  facultyId?: string;
  departmentId?: string;
  programId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus | "";
  search?: string;
}

export interface AttendancePaginationMeta {
  totalPages: number;
  total: number;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AttendanceListResponse {
  attendances: AttendanceRecord[];
  pagination: AttendancePaginationMeta;
}

export interface StudentAttendanceSummary {
  studentId: string;
  studentDetails: {
    id: string;
    studentId: string;
    name: string;
    program: string;
  };
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface DepartmentAttendanceOverview {
  departmentId: string;
  departmentName: string;
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  overallPercentage: number;
  uniqueStudents: number;
  programBreakdown?: Array<{
    programId: string;
    programName: string;
    total: number;
    present: number;
    percentage: number;
  }>;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}
