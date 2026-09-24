/**
 * CampusFlow Dashboard Module — Data Transfer Objects (DTOs)
 */

export interface DashboardQueryDto {
  startDate?: Date;
  endDate?: Date;
  departmentId?: string;
}

export interface UserStatsDto {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
}

export interface StudentStatsDto {
  total: number;
  active: number;
  inactive: number;
}

export interface FacultyStatsDto {
  total: number;
  active: number;
  inactive: number;
}

export interface DepartmentStatsDto {
  total: number;
  active: number;
  inactive: number;
}

export interface SystemStatsDto {
  users: UserStatsDto;
  students: StudentStatsDto;
  faculty: FacultyStatsDto;
  departments: DepartmentStatsDto;
}

export interface AttendanceStatsDto {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface RecentStudentDto {
  id: string;
  studentId: string;
  name: string;
  email: string;
  program: string;
  department: string;
  admissionDate: Date;
  status: string;
  createdAt: Date;
}

export interface RecentFacultyDto {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: string;
  createdAt: Date;
}

export interface RecentDepartmentDto {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: Date;
}

export interface RecentAttendanceDto {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  status: string;
  remarks: string | null;
  markedBy: string;
}

export interface AdminDashboardResponseDto {
  role: "ADMIN";
  systemStats: SystemStatsDto;
  attendanceStats: AttendanceStatsDto;
  recent: {
    students: RecentStudentDto[];
    faculty: RecentFacultyDto[];
    departments: RecentDepartmentDto[];
  };
}

export interface FacultyDashboardResponseDto {
  role: "FACULTY";
  facultyInfo: {
    id: string;
    facultyId: string;
    name: string;
    designation: string;
    department: {
      id: string;
      name: string;
      code: string;
    };
  };
  departmentStats: {
    students: StudentStatsDto;
    faculty: FacultyStatsDto;
    totalDepartments: number;
  };
  attendanceStats: AttendanceStatsDto;
  recent: {
    students: RecentStudentDto[];
    faculty: RecentFacultyDto[];
    recentAttendance: RecentAttendanceDto[];
  };
}

export interface StudentDashboardResponseDto {
  role: "STUDENT";
  studentInfo: {
    id: string;
    studentId: string;
    name: string;
    email: string;
    program: {
      id: string;
      name: string;
      code: string;
    };
    department: {
      id: string;
      name: string;
      code: string;
    };
  };
  attendanceStats: AttendanceStatsDto;
  recentAttendance: RecentAttendanceDto[];
  peersCount: number;
}

export type DashboardResponseDto =
  | AdminDashboardResponseDto
  | FacultyDashboardResponseDto
  | StudentDashboardResponseDto;
