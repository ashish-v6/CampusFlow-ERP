import type { Gender } from "../../generated/prisma/enums.js";

export interface StudentCreateDto {
  userId: string;
  studentId: string;
  admissionDate: Date;
  dateOfBirth?: Date;
  gender?: Gender;
  phone?: string;
  address?: string;
  programId: string;
}
