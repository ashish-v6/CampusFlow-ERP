import { z } from "zod";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

const queryDate = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const ddMMyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!ddMMyyyy) {
    return new Date(Number.NaN);
  }

  const [, day, month, year] = ddMMyyyy;
  const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    parsedDate.getUTCDate() !== Number(day) ||
    parsedDate.getUTCMonth() !== Number(month) - 1 ||
    parsedDate.getUTCFullYear() !== Number(year)
  ) {
    return new Date(Number.NaN);
  }

  return parsedDate;
}, z.coerce.date({ message: "Invalid date format. Expected DD-MM-YYYY" }));

export class AttendanceSchema {
  public markAttendance = z.object({
    studentId: z.uuid().trim(),
    date: queryDate,
    status: z.enum(AttendanceStatus),
  });

  public bulkMarkAttendance = z
    .object({
      date: queryDate,
      records: z
        .array(
          z.object({
            studentId: z.uuid().trim(),
            status: z.enum(AttendanceStatus),
          }),
        )
        .min(1, "At least one attendance record is required"),
    })
    .refine(
      (data) => {
        const ids = data.records.map((r) => r.studentId);
        return new Set(ids).size === ids.length;
      },
      {
        message: "Duplicate student IDs in bulk attendance request",
      },
    );

  public attendanceQuerySchema = z
    .object({
      page: z.coerce.number().default(1).optional(),
      limit: z.coerce.number().min(1).max(50).default(10).optional(),
      studentId: z.uuid().trim().optional(),
      status: z.enum(AttendanceStatus).optional(),
      date: queryDate.optional(),
      fromDate: queryDate.optional(),
      toDate: queryDate.optional(),
    })
    .refine(
      (data) => {
        if (data.fromDate && data.toDate) {
          return data.fromDate.getTime() <= data.toDate.getTime();
        }
        return true;
      },
      {
        message: "From Date cannot be after To Date",
      },
    );

  public attendanceStatsSchema = z
    .object({
      studentId: z.uuid().trim().optional(),
      date: queryDate.optional(),
      fromDate: queryDate.optional(),
      toDate: queryDate.optional(),
    })
    .refine(
      (data) => {
        if (data.fromDate && data.toDate) {
          return data.fromDate.getTime() <= data.toDate.getTime();
        }
        return true;
      },
      {
        message: "From Date cannot be after To Date",
      },
    );

  public attendanceById = z.object({
    id: z.uuid().trim(),
  });

  public updateAttendance = z.object({
    status: z.enum(AttendanceStatus, {
      message: "Status must be either PRESENT or ABSENT",
    }),
  });
}

export const attendanceSchema = new AttendanceSchema();
