import type { DepartmentStatus } from "../../generated/prisma/enums.js";

export interface CreateDepartmentDto {
  name: string;
  code: string;
}

export interface DepartmentResponseDto {
  id: string;
  name: string;
  code: string;
  status: DepartmentStatus;
}

export interface DepartmentListResponseDto {
  departments: DepartmentResponseDto[];
  total: number;
}

export interface DepartmentQueryDto {
  page: number;
  limit: number;
  search?: string;
  status?: DepartmentStatus;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  status?: DepartmentStatus;
}
