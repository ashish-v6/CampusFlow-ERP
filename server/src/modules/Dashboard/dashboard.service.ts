import createHttpError from "http-errors";
import type { User } from "../../middlewares/auth.middlewares.js";
import type {
  AdminDashboardResponseDto,
  DashboardQueryDto,
  DashboardResponseDto,
  FacultyDashboardResponseDto,
  StudentDashboardResponseDto,
} from "./dashboard.dto.js";
import { dashboardRepository } from "./dashboard.repository.js";

export class DashboardService {
  private normalizeDate(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  /**
   * Main service handler returning personalized dashboard metrics based on role
   */
  public async getDashboardData(
    query: DashboardQueryDto,
    currentUser: User,
  ): Promise<DashboardResponseDto> {
    const role = currentUser.role.toUpperCase();

    const dateFilters: { startDate?: Date; endDate?: Date } = {};
    if (query.startDate) dateFilters.startDate = this.normalizeDate(query.startDate);
    if (query.endDate) dateFilters.endDate = this.normalizeDate(query.endDate);

    switch (role) {
      case "ADMIN":
        return this.getAdminDashboard(query, dateFilters);
      case "FACULTY":
        return this.getFacultyDashboard(currentUser.userId, query, dateFilters);
      case "STUDENT":
        return this.getStudentDashboard(currentUser.userId, dateFilters);
      default:
        throw createHttpError(403, "Unauthorized role for dashboard metrics");
    }
  }

  /**
   * Admin dashboard: complete institutional ERP metrics
   */
  private async getAdminDashboard(
    query: DashboardQueryDto,
    dateFilters: { startDate?: Date; endDate?: Date },
  ): Promise<AdminDashboardResponseDto> {
    const attendanceFilter: {
      startDate?: Date;
      endDate?: Date;
      departmentId?: string;
    } = {
      ...dateFilters,
    };
    if (query.departmentId) {
      attendanceFilter.departmentId = query.departmentId;
    }

    const [
      userStats,
      studentStats,
      facultyStats,
      departmentStats,
      attendanceStats,
      recentStudents,
      recentFaculty,
      recentDepartments,
    ] = await Promise.all([
      dashboardRepository.getUserStats(),
      dashboardRepository.getStudentStats(query.departmentId),
      dashboardRepository.getFacultyStats(query.departmentId),
      dashboardRepository.getDepartmentStats(),
      dashboardRepository.getAttendanceStats(attendanceFilter),
      dashboardRepository.getRecentStudents(5, query.departmentId),
      dashboardRepository.getRecentFaculty(5, query.departmentId),
      dashboardRepository.getRecentDepartments(5),
    ]);

    return {
      role: "ADMIN",
      systemStats: {
        users: userStats,
        students: studentStats,
        faculty: facultyStats,
        departments: departmentStats,
      },
      attendanceStats,
      recent: {
        students: recentStudents,
        faculty: recentFaculty,
        departments: recentDepartments,
      },
    };
  }

  /**
   * Faculty dashboard: department-focused metrics and personal activities
   */
  private async getFacultyDashboard(
    userId: string,
    query: DashboardQueryDto,
    dateFilters: { startDate?: Date; endDate?: Date },
  ): Promise<FacultyDashboardResponseDto> {
    const faculty = await dashboardRepository.getFacultyByUserId(userId);
    if (!faculty) {
      throw createHttpError(404, "Faculty profile not found for current user");
    }

    const targetDeptId = query.departmentId || faculty.departmentId;

    const attendanceFilter: {
      startDate?: Date;
      endDate?: Date;
      departmentId?: string;
    } = {
      ...dateFilters,
      departmentId: targetDeptId,
    };

    const [
      deptStudents,
      deptFaculty,
      deptStats,
      attendanceStats,
      recentStudents,
      recentFaculty,
      recentAttendance,
    ] = await Promise.all([
      dashboardRepository.getStudentStats(targetDeptId),
      dashboardRepository.getFacultyStats(targetDeptId),
      dashboardRepository.getDepartmentStats(),
      dashboardRepository.getAttendanceStats(attendanceFilter),
      dashboardRepository.getRecentStudents(5, targetDeptId),
      dashboardRepository.getRecentFaculty(5, targetDeptId),
      dashboardRepository.getRecentAttendance(5, {
        facultyId: faculty.id,
      }),
    ]);

    return {
      role: "FACULTY",
      facultyInfo: {
        id: faculty.id,
        facultyId: faculty.facultyId,
        name: `${faculty.user.firstName} ${faculty.user.lastName}`,
        designation: faculty.designation,
        department: {
          id: faculty.department.id,
          name: faculty.department.name,
          code: faculty.department.code,
        },
      },
      departmentStats: {
        students: deptStudents,
        faculty: deptFaculty,
        totalDepartments: deptStats.total,
      },
      attendanceStats,
      recent: {
        students: recentStudents,
        faculty: recentFaculty,
        recentAttendance,
      },
    };
  }

  /**
   * Student dashboard: personal student profile and personal attendance record
   */
  private async getStudentDashboard(
    userId: string,
    dateFilters: { startDate?: Date; endDate?: Date },
  ): Promise<StudentDashboardResponseDto> {
    const student = await dashboardRepository.getStudentByUserId(userId);
    if (!student) {
      throw createHttpError(404, "Student profile not found for current user");
    }

    const [attendanceStats, recentAttendance, peersCount] = await Promise.all([
      dashboardRepository.getAttendanceStats({
        studentId: student.id,
        ...dateFilters,
      }),
      dashboardRepository.getRecentAttendance(5, {
        studentId: student.id,
      }),
      dashboardRepository.getProgramPeersCount(student.programId),
    ]);

    return {
      role: "STUDENT",
      studentInfo: {
        id: student.id,
        studentId: student.studentId,
        name: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
        program: {
          id: student.program.id,
          name: student.program.name,
          code: student.program.code,
        },
        department: {
          id: student.program.department.id,
          name: student.program.department.name,
          code: student.program.department.code,
        },
      },
      attendanceStats,
      recentAttendance,
      peersCount,
    };
  }
}

export const dashboardService = new DashboardService();
