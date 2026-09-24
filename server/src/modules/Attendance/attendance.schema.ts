import { z } from "zod";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

class AttendanceSchema {
  public markAttendanceSchema = z.object({
    studentId: z.string().uuid("Invalid student ID format"),
    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), "Invalid date"),
    status: z.enum(AttendanceStatus).default("PRESENT"),
    remarks: z.string().trim().max(255).optional(),
  });

  public bulkMarkAttendanceSchema = z.object({
    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), "Invalid date"),
    records: z
      .array(
        z.object({
          studentId: z.string().uuid("Invalid student ID format"),
          status: z.enum(AttendanceStatus).default("PRESENT"),
          remarks: z.string().trim().max(255).optional(),
        }),
      )
      .min(1, "At least one attendance record is required")
      .max(100, "Maximum 100 attendance records allowed per batch"),
  });

  public updateAttendanceSchema = z.object({
    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), "Invalid date").optional(),
    status: z.enum(AttendanceStatus).optional(),
    remarks: z.string().trim().max(255).optional(),
  });

  public queryAttendanceSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(10),
    studentId: z.string().uuid("Invalid student ID format").optional(),
    facultyId: z.string().uuid("Invalid faculty ID format").optional(),
    departmentId: z.string().uuid("Invalid department ID format").optional(),
    programId: z.string().uuid("Invalid program ID format").optional(),
    date: z.coerce.date().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(AttendanceStatus).optional(),
    search: z.string().trim().min(1).max(50).optional(),
  });

  public attendanceIdParamSchema = z.object({
    id: z.string().uuid("Invalid attendance ID format"),
  });

  public studentSummaryParamSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
  });

  public departmentOverviewParamSchema = z.object({
    departmentId: z.string().uuid("Invalid department ID format"),
  });
}

export const attendanceSchema = new AttendanceSchema();
