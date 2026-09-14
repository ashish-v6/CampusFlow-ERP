import { z } from "zod";

class FacultySchema {
  public createFacultySchema = z.object({
    userId: z.uuid(),
    facultyId: z.string().min(8).max(8),
    departmentId: z.uuid(),
    designation: z.string().trim().max(30).min(1),
    joiningDate: z.coerce.date(),
    phone: z.string().regex(/^\d{10}$/),
  });
}

export const facultySchema = new FacultySchema();
