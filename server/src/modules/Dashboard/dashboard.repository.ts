import type * as types from "./dashboard.dto.js";
import { PrismaClient } from "../../generated/prisma/client.js";

export interface IDashboardRepository {
  getStudents: () => Promise<types.StudentCountType>;
  getFaculties: () => Promise<types.FacultyCountType>;
  getDepartments: () => Promise<types.DepartmentCountType>;
  getOneDayAttendance: (date: Date) => Promise<types.OneDayAttendancesType>;
  getAttendanceTrend: (from: Date, to: Date) => Promise<types.AttendanceTrendRecord[]>;
}

export class DashboardRepository implements IDashboardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public getStudents = async (): Promise<types.StudentCountType> => {
    const [totalStudents, activeStudents] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: "ACTIVE" } }),
    ]);
    return { totalStudents, activeStudents };
  };
  public getFaculties = async (): Promise<types.FacultyCountType> => {
    const [totalFaculties, activeFaculties] = await Promise.all([
      this.prisma.faculty.count(),
      this.prisma.faculty.count({ where: { status: "ACTIVE" } }),
    ]);
    return { totalFaculties, activeFaculties };
  };
  public getDepartments = async (): Promise<types.DepartmentCountType> => {
    const [totalDepartments, activeDepartments] = await Promise.all([
      this.prisma.department.count(),
      this.prisma.department.count({ where: { status: "ACTIVE" } }),
    ]);
    return { totalDepartments, activeDepartments };
  };

  public getOneDayAttendance = async (date: Date): Promise<types.OneDayAttendancesType> => {
    const [present, absent] = await Promise.all([
      this.prisma.attendance.count({ where: { date: { gte: date }, status: "PRESENT" } }),
      this.prisma.attendance.count({ where: { date: { gte: date }, status: "ABSENT" } }),
    ]);

    return { present, absent };
  };

  public getAttendanceTrend = async (
    from: Date,
    to: Date,
  ): Promise<types.AttendanceTrendRecord[]> => {
    to.setDate(to.getDate() + 1);
    const attendanceTrends = await this.prisma.attendance.groupBy({
      by: ["date", "status"],
      where: { date: { gte: from, lte: to } },
      orderBy: { date: "asc" },
      _count: {
        _all: true,
      },
    });
    return attendanceTrends;
  };
}
