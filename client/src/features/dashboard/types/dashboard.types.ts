/**
 * CampusFlow Dashboard Module — Type Definitions
 */

export interface DashboardQueryDto {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
}

export interface FacultyStats {
  total: number;
  active: number;
  inactive: number;
}

export interface DepartmentStats {
  total: number;
  active: number;
  inactive: number;
}

export interface SystemStats {
  users: UserStats;
  students: StudentStats;
  faculty: FacultyStats;
  departments: DepartmentStats;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface RecentStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  program: string;
  department: string;
  admissionDate: string;
  status: string;
  createdAt: string;
}

export interface RecentFaculty {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: string;
  createdAt: string;
}

export interface RecentDepartment {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
}

export interface RecentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: string;
  remarks: string | null;
  markedBy: string;
}

export interface AdminDashboardData {
  role: "ADMIN";
  systemStats: SystemStats;
  attendanceStats: AttendanceStats;
  recent: {
    students: RecentStudent[];
    faculty: RecentFaculty[];
    departments: RecentDepartment[];
  };
}

export interface FacultyDashboardData {
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
    students: StudentStats;
    faculty: FacultyStats;
    totalDepartments: number;
  };
  attendanceStats: AttendanceStats;
  recent: {
    students: RecentStudent[];
    faculty: RecentFaculty[];
    recentAttendance: RecentAttendance[];
  };
}

export interface StudentDashboardData {
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
  attendanceStats: AttendanceStats;
  recentAttendance: RecentAttendance[];
  peersCount: number;
}

export type DashboardData =
  | AdminDashboardData
  | FacultyDashboardData
  | StudentDashboardData;
