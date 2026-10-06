import type { Attendance, Prisma } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";
import type { AttendanceResponseDto } from "./attendance.dto.js";

const attendanceSelect = {
  id: true,
  studentId: true,
  facultyId: true,
  date: true,
  status: true,
  remarks: true,
  createdAt: true,
  updatedAt: true,
  student: {
    select: {
      id: true,
      studentId: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      program: {
        select: {
          id: true,
          name: true,
          code: true,
          departmentId: true,
        },
      },
    },
  },
  faculty: {
    select: {
      id: true,
      facultyId: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
};

export class AttendanceRepository {
  public async create(data: Prisma.AttendanceCreateInput): Promise<Attendance> {
    return prisma.attendance.create({ data });
  }

  public async bulkCreate(records: Prisma.AttendanceCreateManyInput[]): Promise<Attendance[]> {
    return prisma.$transaction(
      records.map((data) =>
        prisma.attendance.create({
          data,
        }),
      ),
    );
  }

  public async findById(id: string): Promise<AttendanceResponseDto | null> {
    return prisma.attendance.findUnique({
      where: { id },
      select: attendanceSelect,
    }) as Promise<AttendanceResponseDto | null>;
  }

  public async findByStudentAndDate(studentId: string, date: Date): Promise<Attendance | null> {
    return prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
    });
  }

  public async findExistingStudentDates(
    studentIds: string[],
    date: Date,
  ): Promise<Array<{ studentId: string }>> {
    return prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
        date,
      },
      select: {
        studentId: true,
      },
    });
  }

  public async findMany(
    skip: number,
    limit: number,
    where: Prisma.AttendanceWhereInput,
  ): Promise<{ attendances: AttendanceResponseDto[]; total: number }> {
    const [attendances, total] = await prisma.$transaction([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        select: attendanceSelect,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      attendances: attendances as AttendanceResponseDto[],
      total,
    };
  }

  public async update(id: string, data: Prisma.AttendanceUpdateInput): Promise<Attendance> {
    return prisma.attendance.update({
      where: { id },
      data,
    });
  }

  public async getStudentStats(
    studentId: string,
    dateFilter?: { gte?: Date; lte?: Date },
  ): Promise<{
    total: number;
    present: number;
    absent: number;
    late: number;
  }> {
    const where: Prisma.AttendanceWhereInput = {
      studentId,
      ...(dateFilter && {
        date: {
          ...(dateFilter.gte && { gte: dateFilter.gte }),
          ...(dateFilter.lte && { lte: dateFilter.lte }),
        },
      }),
    };

    const [total, present, absent, late] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
      prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
      prisma.attendance.count({ where: { ...where, status: "LATE" } }),
    ]);

    return { total, present, absent, late };
  }

  public async getDepartmentOverview(departmentId: string): Promise<{
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    uniqueStudents: number;
  }> {
    const where: Prisma.AttendanceWhereInput = {
      student: {
        program: {
          departmentId,
        },
      },
    };

    const [totalRecords, presentCount, absentCount, lateCount, uniqueStudentRows] =
      await Promise.all([
        prisma.attendance.count({ where }),
        prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
        prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
        prisma.attendance.count({ where: { ...where, status: "LATE" } }),
        prisma.attendance.findMany({
          where,
          distinct: ["studentId"],
          select: { studentId: true },
        }),
      ]);

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      uniqueStudents: uniqueStudentRows.length,
    };
  }
}

export const attendanceRepository = new AttendanceRepository();
