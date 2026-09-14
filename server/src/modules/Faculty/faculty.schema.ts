import { z } from "zod";
import { FacultyStatus } from "../../generated/prisma/enums.js";

class FacultySchema {
  public createFacultySchema = z.object({
    userId: z.uuid(),
    facultyId: z.string().min(8).max(8),
    departmentId: z.uuid(),
    designation: z.string().trim().max(30).min(1),
    joiningDate: z.coerce.date(),
    phone: z.string().regex(/^\d{10}$/),
  });
  public getFacultyByIdSchema = z.object({
    id: z.uuid(),
  });
  public getFacultiesSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(10).default(10),
    search: z.string().trim().min(1).max(30).optional(),
    departmentId: z.uuid().optional(),
    status: z.enum(FacultyStatus).optional(),
  });
  public FacultyUpdateShcema = z
    .object({
      departmentId: z.uuid().optional(),
      designation: z.string().trim().max(30).min(1).optional(),
      joiningDate: z.coerce.date().optional(),
      phone: z
        .string()
        .regex(/^\d{10}$/)
        .optional(),
      status: z.enum(FacultyStatus).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    });
}

export const facultySchema = new FacultySchema();
