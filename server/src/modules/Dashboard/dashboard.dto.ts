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

export interface TodayAttendancesType {
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
