import type { Attendance } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";
import * as dtos from "./attendance.dto.js";

export class AttendanceRepository {
    public async findByStudentIdAndDate(studentId : string, date : Date) : Promise<Attendance | null>{
        return prisma.attendance.findFirst({
            where : {
                studentId,
                date
            }
        })
    }
  public async create(dto: dtos.markAttendance) : Promise<Attendance> {
    const { studentId, date, status } = dto;
    return prisma.attendance.create({
      data: {
        studentId,
        date,
        status,
      },
    });
  }
}

export const attendanceRepository = new AttendanceRepository();
