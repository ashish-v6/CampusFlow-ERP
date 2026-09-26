/**
 * CampusFlow Academic Program Module — Type Definitions
 */

export type ProgramStatus = "ACTIVE" | "INACTIVE";

export interface Program {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  status: ProgramStatus;
  createdAt: string;
  updatedAt: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    students: number;
  };
}

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
  status?: ProgramStatus | "";
}

export interface ProgramPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProgramListResponse {
  programs: Program[];
  pagination: ProgramPaginationMeta;
}

export interface ProgramStats {
  total: number;
  active: number;
  inactive: number;
}
