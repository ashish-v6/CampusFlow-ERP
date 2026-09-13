import type { Gender, StudentStatus } from "../../generated/prisma/enums.js";

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

export interface StudentUpdateDto {
  programId?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  phone?: string;
  address?: string;
  status?: StudentStatus;
}

export interface StudentResponseDto {
  id: string;
  userId: string;
  studentId: string;
  status: StudentStatus;
  admissionDate: Date;
  dateOfBirth: Date | null;
  gender: Gender | null;
  phone: string | null;
  address: string | null;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  program: {
    id: string;
    name: string;
    code: string;
  };
}

export interface StudentQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: StudentStatus;
  programId?: string;
}