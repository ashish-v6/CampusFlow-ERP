/**
 * CampusFlow Student Module — Type Definitions
 * 
 * Separate interfaces for data models, creation, updates, querying,
 * and paginated API responses.
 */

export type StudentStatus = "ACTIVE" | "INACTIVE";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface StudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudentProgram {
  id: string;
  name: string;
  code: string;
  status?: "ACTIVE" | "INACTIVE";
  departmentId?: string;
}

export interface StudentStats {
  total: number;
  active: number;
  inActive: number;
  programs: number;
}

/**
 * Main Student entity returned by the backend API.
 * Contains sanitized user data and associated academic program details.
 */
export interface Student {
  id: string;
  userId: string;
  studentId: string;
  status: StudentStatus;
  admissionDate: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  phone: string | null;
  address: string | null;
  createdAt?: string;
  updatedAt?: string;

  user: StudentUser;
  program: StudentProgram;
  programId?: string;
}

/**
 * Payload sent to POST /api/students
 */
export interface StudentCreateDto {
  userId: string;
  studentId: string;
  admissionDate: string;
  programId: string;
  dateOfBirth?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

/**
 * Payload sent to PATCH /api/students/:id
 * Only administrative fields are allowed to be updated.
 */
export interface StudentUpdateDto {
  programId?: string;
  dateOfBirth?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  status?: StudentStatus;
}

/**
 * Query parameters supported by GET /api/students
 */
export interface StudentQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: StudentStatus;
  programId?: string;
}

/**
 * Pagination metadata returned by the CampusFlow backend.
 */
export interface StudentPaginationMeta {
  totalPages: number;
  total: number;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Response structure for GET /api/students
 */
export interface StudentListResponse {
  students: Student[];
  pagination: StudentPaginationMeta;
}

/**
 * Academic Program representation for program filters and selectors.
 */
export interface Program {
  id: string;
  name: string;
  code: string;
  departmentId?: string;
  status: "ACTIVE" | "INACTIVE";
}
