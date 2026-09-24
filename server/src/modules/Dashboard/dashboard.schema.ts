import { z } from "zod";

export class DashboardSchema {
  public dashboardQuerySchema = z.object({
    startDate: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : val),
      z.coerce.date().optional(),
    ),
    endDate: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : val),
      z.coerce.date().optional(),
    ),
    departmentId: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : val),
      z.string().uuid("Invalid department ID format").optional(),
    ),
  });
}

export const dashboardSchema = new DashboardSchema();
