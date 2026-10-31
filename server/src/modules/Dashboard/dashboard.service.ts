import type { IDashboardRepository } from "./dashboard.repository.js";
import type { DashboardOverviewResponseDTO } from "./dashboard.dto.js";
import * as dtos from "./dashboard.dto.js";

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

export interface IDashboardService {
  getOverview: () => Promise<DashboardOverviewResponseDTO>;
  getAttendanceTrends: (
    dto: dtos.AttendanceTrendsDto,
  ) => Promise<dtos.AttendanceTrendResponseDTO[]>;
}

export class DashboardService implements IDashboardService {
  constructor(private readonly dashboardRepo: IDashboardRepository) {}
  public getOverview = async (): Promise<DashboardOverviewResponseDTO> => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const { totalStudents = 0, activeStudents = 0 } = await this.dashboardRepo.getStudents();
    const { totalFaculties = 0, activeFaculties = 0 } = await this.dashboardRepo.getFaculties();
    const { totalDepartments = 0, activeDepartments = 0 } =
      await this.dashboardRepo.getDepartments();
    const { present = 0, absent = 0 } = await this.dashboardRepo.getOneDayAttendance(date);
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
  public getAttendanceTrends = async (
    dto: dtos.AttendanceTrendsDto,
  ): Promise<dtos.AttendanceTrendResponseDTO[]> => {
    const { from, to } = dto;
    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(0, 0, 0, 0);

    const dailyStats = new Map<string, dtos.AttendanceTrendResponseDTO>();
    for (let date = new Date(from); date <= to; date.setDate(date.getDate() + 1)) {
      const dateKey = formatDate(date);
      dailyStats.set(dateKey, {
        date: dateKey,
        present: 0,
        absent: 0,
        marked: 0,
        percentage: 0,
      });
    }
    const attendance = await this.dashboardRepo.getAttendanceTrend(from, to);
    for (const record of attendance) {
      const dateKey = formatDate(record.date);
      const daily = dailyStats.get(dateKey);
      if (!daily) continue;

      if (record.status === "PRESENT") {
        daily.present = record._count._all;
      }
      if (record.status === "ABSENT") {
        daily.absent = record._count._all;
      }
    }
    for (const daily of dailyStats.values()) {
      daily.marked = daily.present + daily.absent;
      daily.percentage =
        daily.marked > 0 ? Number(((daily.present / daily.marked) * 100).toFixed(2)) : 0;
    }
    return Array.from(dailyStats.values());
  };
}
