import type { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";
import type {
  AttendanceStatsDto,
  DepartmentStatsDto,
  FacultyStatsDto,
  RecentAttendanceDto,
  RecentDepartmentDto,
  RecentFacultyDto,
  RecentStudentDto,
  StudentStatsDto,
  UserStatsDto,
} from "./dashboard.dto.js";

export class DashboardRepository {
  /**
   * System-wide user statistics
   */
  public async getUserStats(): Promise<UserStatsDto> {
    const [total, active, suspended, inactive] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
      prisma.user.count({ where: { status: "INACTIVE" } }),
    ]);

    return { total, active, suspended, inactive };
  }

  /**
   * Student counts (system-wide or scoped to a department)
   */
  public async getStudentStats(departmentId?: string): Promise<StudentStatsDto> {
    const where: Prisma.StudentWhereInput = departmentId
      ? { program: { departmentId } }
      : {};

    const [total, active, inactive] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.student.count({ where: { ...where, status: "INACTIVE" } }),
    ]);

    return { total, active, inactive };
  }

  /**
   * Faculty counts (system-wide or scoped to a department)
   */
  public async getFacultyStats(departmentId?: string): Promise<FacultyStatsDto> {
    const where: Prisma.FacultyWhereInput = departmentId
      ? { departmentId }
      : {};

    const [total, active, inactive] = await Promise.all([
      prisma.faculty.count({ where }),
      prisma.faculty.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.faculty.count({ where: { ...where, status: "INACTIVE" } }),
    ]);

    return { total, active, inactive };
  }

  /**
   * Department statistics
   */
  public async getDepartmentStats(): Promise<DepartmentStatsDto> {
    const [total, active, inactive] = await Promise.all([
      prisma.department.count(),
      prisma.department.count({ where: { status: "ACTIVE" } }),
      prisma.department.count({ where: { status: "INACTIVE" } }),
    ]);

    return { total, active, inactive };
  }

  /**
   * Aggregate attendance metrics with optional date range and department filtering
   */
  public async getAttendanceStats(filters?: {
    startDate?: Date;
    endDate?: Date;
    departmentId?: string;
    studentId?: string;
    facultyId?: string;
  }): Promise<AttendanceStatsDto> {
    const where: Prisma.AttendanceWhereInput = {};

    if (filters?.startDate || filters?.endDate) {
      where.date = {
        ...(filters.startDate && { gte: filters.startDate }),
        ...(filters.endDate && { lte: filters.endDate }),
      };
    }

    if (filters?.departmentId) {
      where.student = { program: { departmentId: filters.departmentId } };
    }

    if (filters?.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters?.facultyId) {
      where.facultyId = filters.facultyId;
    }

    const [total, present, absent, late] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
      prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
      prisma.attendance.count({ where: { ...where, status: "LATE" } }),
    ]);

    const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

    return { total, present, absent, late, percentage };
  }

  /**
   * Fetch limited recently registered students
   */
  public async getRecentStudents(limit = 5, departmentId?: string): Promise<RecentStudentDto[]> {
    const students = await prisma.student.findMany({
      ...(departmentId && { where: { program: { departmentId } } }),
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        program: {
          include: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return students.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      name: `${s.user.firstName} ${s.user.lastName}`,
      email: s.user.email,
      program: s.program.name,
      department: s.program.department.name,
      admissionDate: s.admissionDate,
      status: s.status,
      createdAt: s.createdAt,
    }));
  }

  /**
   * Fetch limited recently added faculty
   */
  public async getRecentFaculty(limit = 5, departmentId?: string): Promise<RecentFacultyDto[]> {
    const facultyList = await prisma.faculty.findMany({
      ...(departmentId && { where: { departmentId } }),
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    return facultyList.map((f) => ({
      id: f.id,
      facultyId: f.facultyId,
      name: `${f.user.firstName} ${f.user.lastName}`,
      email: f.user.email,
      designation: f.designation,
      department: f.department.name,
      status: f.status,
      createdAt: f.createdAt,
    }));
  }

  /**
   * Fetch limited recently created departments
   */
  public async getRecentDepartments(limit = 5): Promise<RecentDepartmentDto[]> {
    const departments = await prisma.department.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
        createdAt: true,
      },
    });

    return departments.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      status: d.status,
      createdAt: d.createdAt,
    }));
  }

  /**
   * Fetch limited recent attendance records
   */
  public async getRecentAttendance(
    limit = 5,
    filters?: { studentId?: string; facultyId?: string; departmentId?: string },
  ): Promise<RecentAttendanceDto[]> {
    const where: Prisma.AttendanceWhereInput = {};
    if (filters?.studentId) where.studentId = filters.studentId;
    if (filters?.facultyId) where.facultyId = filters.facultyId;
    if (filters?.departmentId) {
      where.student = { program: { departmentId: filters.departmentId } };
    }

    const records = await prisma.attendance.findMany({
      where,
      take: limit,
      orderBy: { date: "desc" },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        faculty: {
          include: {
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

    return records.map((r) => {
      const studentName = r.student
        ? `${r.student.user.firstName} ${r.student.user.lastName}`
        : "Student";
      const markedBy = r.faculty
        ? `${r.faculty.user.firstName} ${r.faculty.user.lastName}`
        : "System / Admin";

      return {
        id: r.id,
        studentId: r.student?.studentId || r.studentId,
        studentName,
        date: r.date,
        status: r.status,
        remarks: r.remarks,
        markedBy,
      };
    });
  }

  /**
   * Fetch student profile by linked user ID
   */
  public async getStudentByUserId(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        program: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Fetch faculty profile by linked user ID
   */
  public async getFacultyByUserId(userId: string) {
    return prisma.faculty.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  /**
   * Active peer count in student's academic program
   */
  public async getProgramPeersCount(programId: string): Promise<number> {
    return prisma.student.count({
      where: { programId, status: "ACTIVE" },
    });
  }
}

export const dashboardRepository = new DashboardRepository();
