import { AttendanceRepository } from "./attendance.repository.js";
import * as dtos from "./attendance.dto.js";
import createHttpError from "http-errors";
import { studentRepository } from "../Student/student.repository.js";
import type { AttendanceWhereInput } from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";

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

  public async markBulkAttendance(dto: dtos.BulkMarkAttendanceDto) {
    const { date: rawDate, records } = dto;
    const date = new Date(rawDate.getTime());
    date.setUTCHours(0, 0, 0, 0);

    const studentIds = records.map((r) => r.studentId);

    // 1. Verify no duplicate student IDs in input array
    if (new Set(studentIds).size !== studentIds.length) {
      throw createHttpError(400, "Duplicate student IDs in bulk attendance request");
    }

    // 2. Query students to verify existence and active status
    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
      },
      select: {
        id: true,
        status: true,
        studentId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (students.length !== studentIds.length) {
      const foundIds = new Set(students.map((s) => s.id));
      const missing = studentIds.filter((id) => !foundIds.has(id));
      throw createHttpError(404, `One or more students not found: ${missing.join(", ")}`);
    }

    // 3. Reject if any student is inactive
    const inactiveStudents = students.filter((s) => s.status === "INACTIVE");
    if (inactiveStudents.length > 0) {
      const names = inactiveStudents
        .map((s) => `${s.user.firstName} ${s.user.lastName} (${s.studentId})`)
        .join(", ");
      throw createHttpError(422, `Cannot record attendance for inactive students: ${names}`);
    }

    // 4. Check for existing attendance records on this date
    const existing = await this.attendanceRepository.findExistingForStudentsAndDate(
      studentIds,
      date,
    );
    if (existing.length > 0) {
      const conflictList = existing
        .map((e) => `${e.student?.user?.firstName || "Student"} (${e.student?.studentId || e.studentId})`)
        .join(", ");
      throw createHttpError(
        409,
        `Attendance has already been marked on this date for: ${conflictList}`,
      );
    }

    // 5. Atomic database transaction
    const bulkPayload = records.map((r) => ({
      studentId: r.studentId,
      date,
      status: r.status,
    }));

    await this.attendanceRepository.createBulk(bulkPayload);

    return {
      message: "Bulk attendance marked successfully",
      count: bulkPayload.length,
      date,
    };
  }

  private buildWhereClause(query: {
    studentId?: string;
    status?: dtos.AttendanceQueryDto["status"];
    date?: Date;
    fromDate?: Date;
    toDate?: Date;
  }): AttendanceWhereInput {
    const where: AttendanceWhereInput = {};

    if (query.studentId !== undefined) {
      where.studentId = query.studentId;
    }
    if (query.status !== undefined) {
      where.status = query.status;
    }
    if (query.date !== undefined) {
      const normalizedDate = new Date(query.date.getTime());
      normalizedDate.setUTCHours(0, 0, 0, 0);
      where.date = normalizedDate;
    } else if (query.fromDate !== undefined || query.toDate !== undefined) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (query.fromDate !== undefined) {
        const from = new Date(query.fromDate.getTime());
        from.setUTCHours(0, 0, 0, 0);
        dateFilter.gte = from;
      }
      if (query.toDate !== undefined) {
        const to = new Date(query.toDate.getTime());
        to.setUTCHours(23, 59, 59, 999);
        dateFilter.lte = to;
      }
      where.date = dateFilter;
    }

    return where;
  }

  public async fetchAll(query: dtos.AttendanceQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(query);

    const { attendances, total }: dtos.AttendanceListResponseDTO =
      await this.attendanceRepository.findMany(skip, limit, where);
    const totalPages = Math.ceil(total / limit);

    return {
      attendances,
      pagination: {
        total,
        totalPages,
        limit,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  public async fetchStats(query: dtos.AttendanceQueryDto) {
    const where = this.buildWhereClause(query);
    return this.attendanceRepository.getStats(where);
  }

  public async fetchMyAttendance(userId: string, query: dtos.AttendanceQueryDto) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw createHttpError(404, "Student profile not found for authenticated user");
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause({
      ...query,
      studentId: student.id,
    });

    const [{ attendances, total }, summary] = await Promise.all([
      this.attendanceRepository.findMany(skip, limit, where),
      this.attendanceRepository.getStudentSummary(student.id, where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      attendances,
      pagination: {
        total,
        totalPages,
        limit,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      summary,
      student: {
        id: student.id,
        studentId: student.studentId,
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
    const existing = await this.attendanceRepository.findUnique(id);
    if (!existing) {
      throw createHttpError(404, "Attendance not found");
    }
    const { status } = dto;
    if (!status) {
      throw createHttpError(400, "Status is required for update");
    }
    const attendance = await this.attendanceRepository.update(id, { status });

    return attendance;
  }
}

export const attendanceService = new AttendanceService(new AttendanceRepository());
