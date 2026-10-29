import type * as types from "./dashboard.dto.js";
import { PrismaClient } from "../../generated/prisma/client.js";

export interface IDashboardRepository {
  getStudents: () => Promise<types.StudentCountType>;
  getFaculties: () => Promise<types.FacultyCountType>;
  getDepartments: () => Promise<types.DepartmentCountType>;
  getTodayAttendance: () => Promise<types.TodayAttendancesType>;
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

  public getTodayAttendance = async (): Promise<types.TodayAttendancesType> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [present, absent] = await Promise.all([
      this.prisma.attendance.count({ where: { date: { gte: today }, status: "PRESENT" } }),
      this.prisma.attendance.count({ where: { date: { gte: today }, status: "ABSENT" } }),
    ]);

    return { present, absent };
  };
}
