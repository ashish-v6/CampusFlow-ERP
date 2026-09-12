import { z } from "zod";
import { Gender, StudentStatus } from "../../generated/prisma/enums.js";

class StudentSchema {
  public studentCreateSchema = z.object({
    userId: z.uuid(),
    studentId: z.string().trim().max(16).min(8),
    admissionDate: z.coerce.date(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(Gender).optional(),
    phone: z
      .string()
      .regex(/^\d{10}$/)
      .optional(),
    address: z.string().trim().min(8).max(40).optional(),
    programId: z.uuid(),
  });

  public studentUpdateSchema = z
    .object({
      programId: z.uuid().optional(),
      dateOfBirth: z.coerce.date().optional(),
      gender: z.enum(Gender).optional(),
      phone: z
        .string()
        .regex(/^\d{10}$/)
        .optional(),
      address: z.string().trim().min(8).max(40).optional(),
      status: z.enum(StudentStatus).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    });

  public studentQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .min(1, "limit is required")
      .max(10, "Only 10 record can be fetched")
      .default(10),
    status : z.enum(StudentStatus).optional(),
    programId : z.uuid().optional(),
    search : z.string().trim().min(1).max(20).optional(),
  });
}
export const studentSchema = new StudentSchema();
