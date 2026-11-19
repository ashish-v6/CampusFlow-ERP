import { z } from "zod";

const parseFlexibleDate = (value: unknown): Date | unknown => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  // 1. Match DD-MM-YYYY or DD/MM/YYYY
  const ddMMyyyy = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(trimmed);
  if (ddMMyyyy) {
    const [, day, month, year] = ddMMyyyy;
    const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (
      parsedDate.getUTCDate() === Number(day) &&
      parsedDate.getUTCMonth() === Number(month) - 1 &&
      parsedDate.getUTCFullYear() === Number(year)
    ) {
      return parsedDate;
    }
    return new Date(Number.NaN);
  }

  // 2. Match YYYY-MM-DD or YYYY/MM/DD
  const yyyyMMdd = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(trimmed);
  if (yyyyMMdd) {
    const [, year, month, day] = yyyyMMdd;
    const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (
      parsedDate.getUTCDate() === Number(day) &&
      parsedDate.getUTCMonth() === Number(month) - 1 &&
      parsedDate.getUTCFullYear() === Number(year)
    ) {
      return parsedDate;
    }
    return new Date(Number.NaN);
  }

  // 3. Fallback to ISO / parseable date string
  const isoDate = new Date(trimmed);
  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate;
  }

  return new Date(Number.NaN);
};

const queryDate = z.preprocess(
  parseFlexibleDate,
  z
    .date({ message: "Invalid date format. Expected DD-MM-YYYY or YYYY-MM-DD" })
    .refine((d) => !Number.isNaN(d.getTime()), {
      message: "Invalid date format. Expected DD-MM-YYYY or YYYY-MM-DD",
    }),
);

export const dashboardSchema = {
  attendanceTrendsQuerySchema: z
    .preprocess(
      (input: unknown) => {
        if (input && typeof input === "object") {
          const record = { ...(input as Record<string, unknown>) };
          if (!record.from && record.fromDate) record.from = record.fromDate;
          if (!record.to && record.toDate) record.to = record.toDate;
          return record;
        }
        return input;
      },
      z
        .object({
          from: queryDate,
          to: queryDate,
        })
        .refine(({ from, to }) => from <= to, {
          message: "'from' date must be on or before 'to' date",
          path: ["from"],
        }),
    ),

  departmentStatsQuerySchema: z
    .preprocess(
      (input: unknown) => {
        if (input && typeof input === "object") {
          const record = { ...(input as Record<string, unknown>) };
          if (!record.fromDate && record.from) record.fromDate = record.from;
          if (!record.toDate && record.to) record.toDate = record.to;
          return record;
        }
        return input;
      },
      z
        .object({
          fromDate: queryDate,
          toDate: queryDate,
        })
        .refine(({ fromDate, toDate }) => fromDate <= toDate, {
          message: "'fromDate' date must be on or before 'toDate' date",
          path: ["fromDate"],
        }),
    ),
};
