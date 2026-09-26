import { z } from "zod";

const isNotFutureDate = (date: Date) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
};

export class DashboardSchema {
  public dashboardQuerySchema = z
    .object({
      startDate: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : val),
        z.coerce
          .date()
          .refine(isNotFutureDate, { message: "Start date cannot be in the future" })
          .optional(),
      ),
      endDate: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : val),
        z.coerce
          .date()
          .refine(isNotFutureDate, { message: "End date cannot be in the future" })
          .optional(),
      ),
      departmentId: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : val),
        z.string().uuid("Invalid department ID format").optional(),
      ),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return data.startDate <= data.endDate;
        }
        return true;
      },
      {
        message: "Start date must be before or equal to end date",
        path: ["startDate"],
      },
    );
}

export const dashboardSchema = new DashboardSchema();
