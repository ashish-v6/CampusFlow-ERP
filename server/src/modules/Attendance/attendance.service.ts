import { AttendanceRepository } from "./attendance.repository.js";
import * as dtos from "./attendance.dto.js";
import createHttpError from "http-errors";
import { studentRepository } from "../Student/student.repository.js";
import type { AttendanceWhereInput } from "../../generated/prisma/models.js";

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}
  public async markAttendance(dto: dtos.markAttendance) {
    const { studentId, status } = dto;
    const date = new Date(dto.date.getTime());
    date.setUTCHours(0, 0, 0, 0);

    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw createHttpError(404, "Student not found");
    }
    if (student.status === "INACTIVE") {
      throw createHttpError(422, "Student is inactive");
    }

    const attendance = await this.attendanceRepository.findByStudentIdAndDate(studentId, date);
    if (attendance) {
      throw createHttpError(409, "Attendance already marked");
    }

    return this.attendanceRepository.create({ studentId, date, status });
  }

  public async fetchAll(query: dtos.AttendanceQueryDto) {
    //pagination
    const { page = 1, limit = 10, studentId, status, fromDate, toDate, date } = query;
    const skip = (page - 1) * limit;

    //filters
    const where: AttendanceWhereInput = {};
    if (studentId !== undefined) {
      where.studentId = studentId;
    }
    if (status !== undefined) {
      where.status = status;
    }
    if (date !== undefined) {
      where.date = date;
    }
    if (fromDate !== undefined && toDate !== undefined) {
      where.AND = [
        {
          date: {
            gte: fromDate,
          },
        },
        {
          date: {
            lte: toDate,
          },
        },
      ];
    }

    const { attendances, total }: dtos.AttendanceListResponseDTO =
      await this.attendanceRepository.findMany(skip, limit, where);
    const totalPages = Math.ceil(total / limit);
    return {
      attendances,
      pagination: {
        total,
        totalPages,
        limit,
        cureentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
  public async fetchOne(id: string) {
    const attendance = await this.attendanceRepository.findUnique(id);
    if (!attendance) {
      throw createHttpError(404, "Attendance not found");
    }
    return attendance;
  }

  public async updateAttendance(id: string, dto: dtos.updateAttendance) {
    if (!(await this.attendanceRepository.findUnique(id))) {
      throw createHttpError(404, "Attendance not found");
    }
    const attendance = await this.attendanceRepository.update(id, dto);

    return attendance;
  }
}

export const attendanceService = new AttendanceService(new AttendanceRepository());
