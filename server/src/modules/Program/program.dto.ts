import type { ProgramStatus } from "../../generated/prisma/enums.js";

export interface CreateProgramDto {
  name: string;
  code: string;
  departmentId: string;
  status: ProgramStatus;
}

export interface UpdateProgramDto {
  name?: string;
  code?: string;
  departmentId?: string;
  status?: ProgramStatus;
}

export interface ProgramQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: ProgramStatus;
}

export interface ProgramResponseDto {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  status: ProgramStatus;
  createdAt: Date;
  updatedAt: Date;
  department: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    students: number;
  };
}

export interface ProgramStatsDto {
  total: number;
  active: number;
  inactive: number;
}
