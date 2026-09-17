import { z } from "zod";
import { DepartmentStatus } from "../../generated/prisma/enums.js";

export class DepartmentSchema {
  public createDepartmentSchema = z.object({
    name: z.string().trim().min(1).max(40),
    code: z.string().trim().min(1).max(12),
  });

  public departmentQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(10).default(10),
    search: z.string().trim().min(1).max(20).optional(),
    status: z.enum(DepartmentStatus).optional(),
  });

  public updateDepartmentSchema = z
    .object({
      name: z.string().trim().min(1).max(40).optional(),
      code: z.string().trim().min(1).max(12).optional(),
      status: z.enum(DepartmentStatus).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
}

export const departmentSchema = new DepartmentSchema();
