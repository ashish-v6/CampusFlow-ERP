import type { Attendance, AttendanceStatus } from "../../generated/prisma/client.js";
import type { AttendanceWhereInput } from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";
import * as dtos from "./attendance.dto.js";

export class AttendanceRepository {
  public async findByStudentIdAndDate(studentId: string, date: Date): Promise<Attendance | null> {
    return prisma.attendance.findFirst({
      where: {
        studentId,
        date,
      },
    });
  }

  public async findExistingForStudentsAndDate(
    studentIds: string[],
    date: Date,
  ): Promise<
    Array<{
      id: string;
      studentId: string;
      date: Date;
      status: AttendanceStatus;
      student: {
        studentId: string;
        user: {
          firstName: string;
          lastName: string;
        };
      };
    }>
  > {
    return prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
        date,
      },
      select: {
        id: true,
        studentId: true,
        date: true,
        status: true,
        student: {
          select: {
            studentId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  public async create(dto: dtos.markAttendance): Promise<Attendance> {
    const { studentId, date, status } = dto;
    return prisma.attendance.create({
      data: {
        studentId,
        date,
        status,
      },
    });
  }

  public async createBulk(
    records: Array<{
      studentId: string;
      date: Date;
      status: AttendanceStatus;
    }>,
  ): Promise<{ count: number }> {
    return prisma.$transaction(async (tx) => {
      return tx.attendance.createMany({
        data: records,
      });
    });
  }

  public async findMany(
    skip: number,
    take: number,
    where: AttendanceWhereInput,
  ): Promise<dtos.AttendanceListResponseDTO> {
    const [attendances, total] = await prisma.$transaction([
      prisma.attendance.findMany({
        skip,
        take,
        where,
        select: {
          id: true,
          studentId: true,
          student: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  status: true,
                },
              },
            },
          },
          date: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          date: "desc",
        },
      }),
      prisma.attendance.count({
        where,
      }),
    ]);
    return { attendances, total };
  }

  public async getStats(where: AttendanceWhereInput): Promise<dtos.AttendanceStatsDTO> {
    const [totalStudents, present, absent] = await prisma.$transaction([
      prisma.student.count({ where: { status: "ACTIVE" } }),
      prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
      prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
    ]);

    const totalMarked = present + absent;
    const percentage = totalMarked > 0 ? Math.round((present / totalMarked) * 100 * 10) / 10 : 0;

    return {
      totalStudents,
      present,
      absent,
      totalMarked,
      percentage,
    };
  }

  public async getStudentSummary(
    studentId: string,
    where: AttendanceWhereInput,
  ): Promise<dtos.StudentAttendanceSummaryDTO> {
    const [present, absent] = await prisma.$transaction([
      prisma.attendance.count({ where: { ...where, studentId, status: "PRESENT" } }),
      prisma.attendance.count({ where: { ...where, studentId, status: "ABSENT" } }),
    ]);

    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0;

    return {
      total,
      present,
      absent,
      percentage,
    };
  }

  public async findUnique(id: string): Promise<dtos.AttendanceResponseDTO | null> {
    return prisma.attendance.findUnique({
      where: { id },
      select: {
        id: true,
        studentId: true,
        student: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                status: true,
              },
            },
          },
        },
        date: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<dtos.AttendanceResponseDTO | null>;
  }

  public async update(id: string, data: dtos.updateAttendance): Promise<dtos.AttendanceResponseDTO> {
    return prisma.attendance.update({
      where: { id },
      data,
      select: {
        id: true,
        studentId: true,
        student: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                status: true,
              },
            },
          },
        },
        date: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<dtos.AttendanceResponseDTO>;
  }
}

export const attendanceRepository = new AttendanceRepository();
