import { z } from "zod";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

const queryDate = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const ddMMyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
    if (!ddMMyyyy) {
      return value;
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
  },
  z.coerce.date(),
);

export class AttendanceSchema {
  public markAttendance = z.object({
    studentId: z.uuid().trim(),
    date: z.coerce.date(),
    status: z.enum(AttendanceStatus),
  });
  public attendanceQuerySchema = z
    .object({
      page: z.coerce.number().default(1).optional(),
      limit: z.coerce.number().min(10).max(10).default(10).optional(),
      studentId: z.uuid().trim().optional(),
      status: z.enum(AttendanceStatus).optional(),
      date: queryDate.optional(),
      fromDate: queryDate.optional(),
      toDate: queryDate.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
}

export const attendanceSchema = new AttendanceSchema();
