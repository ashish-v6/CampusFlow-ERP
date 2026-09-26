import { z } from "zod";
import { ProgramStatus } from "../../generated/prisma/enums.js";

export class ProgramSchema {
  public createProgramSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, "Program name must be at least 2 characters")
      .max(100, "Program name must be at most 100 characters"),
    code: z
      .string()
      .trim()
      .min(2, "Program code must be at least 2 characters")
      .max(20, "Program code must be at most 20 characters")
      .regex(/^[A-Z0-9\-_]+$/, "Program code must be uppercase alphanumeric (e.g. CS-BS, IT-BE)"),
    departmentId: z.string().uuid("Invalid department ID format"),
    status: z.enum(ProgramStatus).default("ACTIVE"),
  });

  public programQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).max(50).optional(),
    departmentId: z.string().uuid("Invalid department ID format").optional(),
    status: z.enum(ProgramStatus).optional(),
  });

  public updateProgramSchema = z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Program name must be at least 2 characters")
        .max(100, "Program name must be at most 100 characters")
        .optional(),
      code: z
        .string()
        .trim()
        .min(2, "Program code must be at least 2 characters")
        .max(20, "Program code must be at most 20 characters")
        .regex(/^[A-Z0-9\-_]+$/, "Program code must be uppercase alphanumeric (e.g. CS-BS, IT-BE)")
        .optional(),
      departmentId: z.string().uuid("Invalid department ID format").optional(),
      status: z.enum(ProgramStatus).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required to update",
    });

  public programIdParamSchema = z.object({
    id: z.string().uuid("Invalid program ID format"),
  });
}

export const programSchema = new ProgramSchema();
