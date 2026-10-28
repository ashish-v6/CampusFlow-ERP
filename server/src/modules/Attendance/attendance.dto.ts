import type { AttendanceStatus, UserStatus } from "../../generated/prisma/enums.js";

export interface markAttendance {
  studentId: string;
  date: Date;
  status: AttendanceStatus;
}

export interface BulkAttendanceItemDto {
  studentId: string;
  status: AttendanceStatus;
}

export interface BulkMarkAttendanceDto {
  date: Date;
  records: BulkAttendanceItemDto[];
}

export interface AttendanceQueryDto {
  page?: number;
  limit?: number;
  studentId?: string;
  status?: AttendanceStatus;
  date?: Date;
  fromDate?: Date;
  toDate?: Date;
}

export interface AttendanceResponseDTO {
  id: string;
  studentId: string;
  student: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      status: UserStatus;
    };
  };
  date: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceListResponseDTO {
  attendances: AttendanceResponseDTO[];
  total: number;
}

export interface AttendanceStatsDTO {
  totalStudents: number;
  present: number;
  absent: number;
  totalMarked: number;
  percentage: number;
}

export interface StudentAttendanceSummaryDTO {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface StudentAttendanceResponseDTO {
  attendances: AttendanceResponseDTO[];
  pagination: {
    total: number;
    totalPages: number;
    limit: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: StudentAttendanceSummaryDTO;
}

export interface updateAttendance {
  date?: Date;
  status?: AttendanceStatus;
}
