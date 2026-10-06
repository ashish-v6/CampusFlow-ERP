import type { AttendanceStatus } from "../../generated/prisma/enums.js";

export interface MarkAttendanceDto {
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkMarkAttendanceItemDto {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkMarkAttendanceDto {
  date: Date;
  records: BulkMarkAttendanceItemDto[];
}

export interface UpdateAttendanceDto {
  date?: Date;
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
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  status?: AttendanceStatus;
  search?: string;
}

export interface AttendanceResponseDto {
  id: string;
  studentId: string;
  facultyId: string | null;
  date: Date;
  status: AttendanceStatus;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
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

export interface StudentAttendanceSummaryDto {
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

export interface DepartmentAttendanceOverviewDto {
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
