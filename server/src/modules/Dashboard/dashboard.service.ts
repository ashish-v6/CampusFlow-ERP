import type { IDashboardRepository } from "./dashboard.repository.js";
import type { DashboardOverviewResponseDTO } from "./dashboard.dto.js";

export interface IDashboardService {
  getOverview: () => Promise<DashboardOverviewResponseDTO>;
}

export class DashboardService implements IDashboardService {
  constructor(private readonly dashboardRepo: IDashboardRepository) {}
  public getOverview = async (): Promise<DashboardOverviewResponseDTO> => {
    const {
      totalStudents = 0,
      activeStudents = 0,
    } = await this.dashboardRepo.getStudents();
    const {
      totalFaculties = 0,
      activeFaculties = 0,
    } = await this.dashboardRepo.getFaculties();
    const {
      totalDepartments = 0,
      activeDepartments = 0,
    } = await this.dashboardRepo.getDepartments();
    const { 
      present = 0, 
      absent = 0 
    } = await this.dashboardRepo.getTodayAttendance();
    const markedAttendance = present + absent;
    const percentage = markedAttendance === 0 ? 0 : (present / markedAttendance) * 100;
    const unmarked = activeStudents - markedAttendance;
    return {
      success: true,
      data: {
        totalStudents,
        activeStudents,
        totalFaculties,
        activeFaculties,
        totalDepartments,
        activeDepartments,
        todayAttendance: {
          present,
          absent,
          unmarked,
          percentage,
        },
      },
    };
  };
}
