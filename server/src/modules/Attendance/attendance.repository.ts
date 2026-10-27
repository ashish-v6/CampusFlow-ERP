import type { Attendance } from "../../generated/prisma/client.js";
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
  public async findMany(skip : number, take : number, where: AttendanceWhereInput): Promise<dtos.AttendanceListResponseDTO> {
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
      }),
      prisma.attendance.count({
        where,
      }),
    ]);
    return { attendances, total };
  }
}

export const attendanceRepository = new AttendanceRepository();
