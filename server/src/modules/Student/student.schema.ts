import { z } from "zod";
import { Gender } from "../../generated/prisma/enums.js";

class StudentSchema {
  public studentCreateSchema = z.object({
    userId: z.string().uuid(),
    studentId: z.string().trim().max(16).min(8),
    admissionDate: z.coerce.date(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(Gender).optional(),
    phone: z.string().regex(/^\d{10}$/).optional(),
    address: z.string().trim().min(8).max(40).optional(),
    programId: z.uuid(),
  });
}
export const studentSchema = new StudentSchema();
