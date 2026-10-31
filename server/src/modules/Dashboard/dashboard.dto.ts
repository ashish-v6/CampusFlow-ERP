export interface StudentCountType {
  totalStudents: number;
  activeStudents: number;
}
export interface FacultyCountType {
  totalFaculties: number;
  activeFaculties: number;
}
export interface DepartmentCountType {
  totalDepartments: number;
  activeDepartments: number;
}

export interface OneDayAttendancesType {
  present: number;
  absent: number;
}

export interface DashboardOverviewResponseDTO {
  success: true;
  data: {
    totalStudents: number;
    activeStudents: number;
    totalFaculties: number;
    activeFaculties: number;
    totalDepartments: number;
    activeDepartments: number;
    todayAttendance: {
      present: number;
      absent: number;
      unmarked: number;
      percentage: number;
    };
  };
}

export interface AttendanceTrendsDto {
  from: Date;
  to: Date;
}

export interface AttendanceTrendRecord {
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE";
  _count: {
    _all: number;
  };
}

export interface AttendanceTrendResponseDTO {
  date: string;
  present: number;
  absent: number;
  marked: number;
  percentage: number;
}
