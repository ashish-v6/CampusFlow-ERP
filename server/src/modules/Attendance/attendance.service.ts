import createHttpError from "http-errors";
import type { Prisma } from "../../generated/prisma/client.js";
import type { User } from "../../middlewares/auth.middlewares.js";
import prisma from "../../utils/prisma.js";
import { facultyRepository } from "../Faculty/faculty.repository.js";
import { studentRepository } from "../Student/student.repository.js";
import type * as dtos from "./attendance.dto.js";
import { AttendanceRepository, attendanceRepository } from "./attendance.repository.js";

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Normalizes any Date or ISO string to UTC calendar date (YYYY-MM-DD)
   */
  private normalizeDate(date: Date | string): Date {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw createHttpError(400, "Invalid date format");
    }
    const dateStr = d.toISOString().split("T")[0];
    return new Date(`${dateStr}T00:00:00.000Z`);
  }

  /**
   * Helper to resolve facultyId if the current user is a Faculty or Admin
   */
  private async resolveFacultyId(currentUser: User): Promise<string | null> {
    const faculty = await facultyRepository.findByAnyId({ userId: currentUser.userId });
    return faculty ? faculty.id : null;
  }

  /**
   * Mark attendance for a single student
   */
  public async markAttendance(
    dto: dtos.MarkAttendanceDto,
    currentUser: User,
  ): Promise<dtos.AttendanceResponseDto> {
    const normalizedDate = this.normalizeDate(dto.date);

    // 1. Verify student exists and is active
    const student = await studentRepository.findById(dto.studentId);
    if (!student) {
      throw createHttpError(404, "Student not found");
    }
    if (student.status !== "ACTIVE") {
      throw createHttpError(400, "Cannot mark attendance for an inactive student");
    }

    // 2. Prevent duplicate attendance on the same date for this student
    const existing = await this.attendanceRepository.findByStudentAndDate(
      dto.studentId,
      normalizedDate,
    );
    if (existing) {
      throw createHttpError(409, "Attendance already marked for this student on this date");
    }

    // 3. Resolve facultyId of the marker
    const facultyId = await this.resolveFacultyId(currentUser);

    const createInput: Prisma.AttendanceCreateInput = {
      date: normalizedDate,
      status: dto.status,
      remarks: dto.remarks ? dto.remarks.trim() : null,
      student: { connect: { id: dto.studentId } },
      ...(facultyId && { faculty: { connect: { id: facultyId } } }),
    };

    const created = await this.attendanceRepository.create(createInput);
    const result = await this.attendanceRepository.findById(created.id);
    return result!;
  }

  /**
   * Mark attendance for multiple students in an atomic transaction
   */
  public async bulkMarkAttendance(
    dto: dtos.BulkMarkAttendanceDto,
    currentUser: User,
  ): Promise<{
    count: number;
    date: Date;
    attendances: dtos.AttendanceResponseDto[];
  }> {
    const normalizedDate = this.normalizeDate(dto.date);

    // 1. Check for duplicates within the submitted batch
    const studentIds = dto.records.map((r) => r.studentId);
    const uniqueIds = new Set(studentIds);
    if (uniqueIds.size !== studentIds.length) {
      throw createHttpError(400, "Duplicate student IDs detected in bulk attendance batch");
    }

    // 2. Verify all students exist and are active
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, status: true },
    });

    if (students.length !== studentIds.length) {
      const foundIds = new Set(students.map((s) => s.id));
      const missingIds = studentIds.filter((id) => !foundIds.has(id));
      throw createHttpError(404, `One or more students not found: ${missingIds.slice(0, 3).join(", ")}`);
    }

    const inactive = students.filter((s) => s.status !== "ACTIVE");
    if (inactive.length > 0) {
      throw createHttpError(400, `Cannot mark attendance for inactive students (${inactive.length} found)`);
    }

    // 3. Check for existing attendance records on this date
    const existing = await this.attendanceRepository.findExistingStudentDates(
      studentIds,
      normalizedDate,
    );
    if (existing.length > 0) {
      throw createHttpError(
        409,
        `Attendance already exists for ${existing.length} student(s) on this date`,
      );
    }

    // 4. Resolve facultyId
    const facultyId = await this.resolveFacultyId(currentUser);

    // 5. Create records atomically
    const recordsToCreate: Prisma.AttendanceCreateManyInput[] = dto.records.map((r) => ({
      studentId: r.studentId,
      facultyId,
      date: normalizedDate,
      status: r.status,
      remarks: r.remarks ? r.remarks.trim() : null,
    }));

    const createdRecords = await this.attendanceRepository.bulkCreate(recordsToCreate);

    // Fetch rich response objects
    const createdIds = createdRecords.map((c) => c.id);
    const { attendances } = await this.attendanceRepository.findMany(0, createdIds.length, {
      id: { in: createdIds },
    });

    return {
      count: attendances.length,
      date: normalizedDate,
      attendances,
    };
  }

  /**
   * Update an existing attendance record
   */
  public async updateAttendance(
    id: string,
    dto: dtos.UpdateAttendanceDto,
  ): Promise<dtos.AttendanceResponseDto> {
    const existing = await this.attendanceRepository.findById(id);
    if (!existing) {
      throw createHttpError(404, "Attendance record not found");
    }

    let normalizedDate: Date | undefined;
    if (dto.date !== undefined) {
      normalizedDate = this.normalizeDate(dto.date);
      // If date is changing, ensure no duplicate exists on the new date
      const existingDateStr = new Date(existing.date).toISOString().split("T")[0];
      const newDateStr = normalizedDate.toISOString().split("T")[0];
      if (existingDateStr !== newDateStr) {
        const conflict = await this.attendanceRepository.findByStudentAndDate(
          existing.studentId,
          normalizedDate,
        );
        if (conflict && conflict.id !== id) {
          throw createHttpError(409, "Attendance already marked for this student on the specified date");
        }
      }
    }

    const updateData: Prisma.AttendanceUpdateInput = {
      ...(normalizedDate && { date: normalizedDate }),
      ...(dto.status && { status: dto.status }),
      ...(dto.remarks !== undefined && { remarks: dto.remarks ? dto.remarks.trim() : null }),
    };

    await this.attendanceRepository.update(id, updateData);
    const updated = await this.attendanceRepository.findById(id);
    return updated!;
  }

  /**
   * Fetch a single attendance record by ID
   */
  public async getAttendanceById(
    id: string,
    currentUser: User,
  ): Promise<dtos.AttendanceResponseDto> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw createHttpError(404, "Attendance record not found");
    }

    if (currentUser.role.toUpperCase() === "STUDENT") {
      const student = await studentRepository.findByUserId(currentUser.userId);
      if (!student || student.id !== attendance.studentId) {
        throw createHttpError(403, "Not authorized to view this attendance record");
      }
    }

    return attendance;
  }

  /**
   * Query attendance with pagination and filtering
   */
  public async findAttendances(
    query: dtos.AttendanceQueryDto,
    currentUser: User,
  ): Promise<{
    attendances: dtos.AttendanceResponseDto[];
    pagination: {
      totalPages: number;
      total: number;
      limit: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {};

    // RBAC: If requester is a STUDENT, strictly scope to their student record
    if (currentUser.role.toUpperCase() === "STUDENT") {
      const student = await studentRepository.findByUserId(currentUser.userId);
      if (!student) {
        throw createHttpError(404, "Student record not found for current user");
      }
      where.studentId = student.id;
    } else {
      if (query.studentId) {
        where.studentId = query.studentId;
      }
    }

    if (query.facultyId) {
      where.facultyId = query.facultyId;
    }

    if (query.status) {
      where.status = query.status;
    }

    // Student-level filters (program, department, search)
    const studentWhere: Prisma.StudentWhereInput = {};

    if (query.programId) {
      studentWhere.programId = query.programId;
    }

    if (query.departmentId) {
      studentWhere.program = {
        departmentId: query.departmentId,
      };
    }

    // Search query matching student ID, firstName, or lastName
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      studentWhere.OR = [
        { studentId: { contains: term, mode: "insensitive" } },
        { user: { firstName: { contains: term, mode: "insensitive" } } },
        { user: { lastName: { contains: term, mode: "insensitive" } } },
      ];
    }

    if (Object.keys(studentWhere).length > 0) {
      where.student = studentWhere;
    }

    // Date filtering (exact date or date range)
    if (query.date) {
      where.date = this.normalizeDate(query.date);
    } else if (query.startDate || query.endDate) {
      const dateRange: Prisma.DateTimeFilter = {};
      if (query.startDate) dateRange.gte = this.normalizeDate(query.startDate);
      if (query.endDate) dateRange.lte = this.normalizeDate(query.endDate);
      where.date = dateRange;
    }

    const { attendances, total } = await this.attendanceRepository.findMany(
      skip,
      limit,
      where,
    );

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      attendances,
      pagination: {
        totalPages,
        total,
        limit,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get attendance summary for a student (total, present, absent, percentage)
   */
  public async getStudentAttendanceSummary(
    studentIdOrMe: string,
    currentUser: User,
    dateFilter?: { startDate?: Date; endDate?: Date },
  ): Promise<dtos.StudentAttendanceSummaryDto> {
    let targetStudentId = studentIdOrMe;

    if (studentIdOrMe === "me" || currentUser.role.toUpperCase() === "STUDENT") {
      const student = await studentRepository.findByUserId(currentUser.userId);
      if (!student) {
        throw createHttpError(404, "Student profile not found for current user");
      }
      if (studentIdOrMe !== "me" && student.id !== studentIdOrMe) {
        throw createHttpError(403, "Not authorized to view other student's attendance summary");
      }
      targetStudentId = student.id;
    }

    const student = await studentRepository.findById(targetStudentId);
    if (!student) {
      throw createHttpError(404, "Student not found");
    }

    const normalizedDateFilter = dateFilter
      ? {
          ...(dateFilter.startDate && { gte: this.normalizeDate(dateFilter.startDate) }),
          ...(dateFilter.endDate && { lte: this.normalizeDate(dateFilter.endDate) }),
        }
      : undefined;

    const stats = await this.attendanceRepository.getStudentStats(
      targetStudentId,
      normalizedDateFilter,
    );

    const percentage =
      stats.total > 0 ? Number(((stats.present / stats.total) * 100).toFixed(2)) : 0;

    return {
      studentId: student.id,
      studentDetails: {
        id: student.id,
        studentId: student.studentId,
        name: `${student.user.firstName} ${student.user.lastName}`,
        program: student.program.name,
      },
      total: stats.total,
      present: stats.present,
      absent: stats.absent,
      late: stats.late,
      percentage,
    };
  }

  /**
   * Get aggregate attendance overview for a department
   */
  public async getDepartmentOverview(
    departmentId: string,
  ): Promise<dtos.DepartmentAttendanceOverviewDto> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      throw createHttpError(404, "Department not found");
    }

    const overview = await this.attendanceRepository.getDepartmentOverview(departmentId);

    const overallPercentage =
      overview.totalRecords > 0
        ? Number(((overview.presentCount / overview.totalRecords) * 100).toFixed(2))
        : 0;

    // Get breakdown by programs within the department
    const programs = await prisma.program.findMany({
      where: { departmentId },
      select: { id: true, name: true },
    });

    const programBreakdown = await Promise.all(
      programs.map(async (p) => {
        const where: Prisma.AttendanceWhereInput = { student: { programId: p.id } };
        const [total, present] = await Promise.all([
          prisma.attendance.count({ where }),
          prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
        ]);
        const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;
        return {
          programId: p.id,
          programName: p.name,
          total,
          present,
          percentage,
        };
      }),
    );

    return {
      departmentId: department.id,
      departmentName: department.name,
      totalRecords: overview.totalRecords,
      presentCount: overview.presentCount,
      absentCount: overview.absentCount,
      lateCount: overview.lateCount,
      overallPercentage,
      uniqueStudents: overview.uniqueStudents,
      programBreakdown,
    };
  }
}

export const attendanceService = new AttendanceService(attendanceRepository);
