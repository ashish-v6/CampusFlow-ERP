import type * as types from "./dashboard.dto.js";
import { PrismaClient } from "../../generated/prisma/client.js";

export interface IDashboardRepository {
  getStudents: () => Promise<types.StudentCountType>;
  getFaculties: () => Promise<types.FacultyCountType>;
  getDepartments: () => Promise<types.DepartmentCountType>;
  getOneDayAttendance: (date: Date) => Promise<types.OneDayAttendancesType>;
  getAttendanceTrend: (from: Date, to: Date) => Promise<types.AttendanceTrendRecord[]>;
  getDepartmentStats: (fromDate: Date, toDate: Date) => Promise<types.DepartmentStatsRecord[]>;
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

  public getDepartmentStats = async (
    fromDate: Date,
    toDate: Date,
  ): Promise<types.DepartmentStatsRecord[]> => {
    const departments = await this.prisma.department.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        programs: {
          select: {
            id: true,
          },
        },
      },
    });
    const studentCounts = await this.prisma.student.groupBy({
      by: ["programId"],
      _count: {
        _all: true,
      },
    });
    const activeStudentCounts = await this.prisma.student.groupBy({
      by: ["programId"],
      _count: {
        _all: true,
      },
      where: {
        status: "ACTIVE",
      },
    });
    const attendance = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: {
        status: true,
        student: {
          select: {
            programId: true,
            status : true,
          },
        },
      },
    });
    console.log(attendance);
    const res :types.DepartmentStatsRecord[] = [];
    for (const department of departments) {
      let totalStudents = 0;
      let activeStudents = 0;
      let present = 0;
      let absent = 0;
      let late = 0;
      for (const program of department.programs) {
        const studentCount = studentCounts.find((item) => item.programId === program.id);
        const activeStudentCount = activeStudentCounts.find(
          (item) => item.programId === program.id,
        );
        const attendanceCount = attendance.filter((item) => item.student.programId === program.id);
        present += attendanceCount.filter((item) => item.status === "PRESENT" && item.student.status === "ACTIVE").length;
        absent += attendanceCount.filter((item) => item.status === "ABSENT" && item.student.status === "ACTIVE").length;
        late += attendanceCount.filter((item) => item.status === "LATE" && item.student.status === "ACTIVE").length;
        totalStudents += studentCount?._count._all ?? 0;
        activeStudents += activeStudentCount?._count._all ?? 0;
      }

      res.push({
        departmentName: department.name,
        departmentId: department.id,
        totalStudents,
        activeStudents,
        attendance: {
          present,
          absent,
          late,
        },
      });
    }
    return res;
  };
}
