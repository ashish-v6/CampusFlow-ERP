import type { AttendanceStatus, UserStatus } from "../../generated/prisma/enums.js";

export interface markAttendance {
  studentId: string;
  date: Date;
  status: AttendanceStatus;
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

export interface updateAttendance {
  date?: Date;
  status?: AttendanceStatus;
}
