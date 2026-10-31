import { z } from "zod";

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


export const dashboardSchema = {
  attendanceTrendsQuerySchema: z
    .object({
      from: queryDate,
      to: queryDate,
    })
    .refine(({ from, to }) => from <= to, {
      message: "'from' date must be on or before 'to' date",
      path: ["from"],
    }),
};
