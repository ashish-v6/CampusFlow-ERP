/**
 * CampusFlow Faculty Module — Type Definitions
 * 
 * Defines interfaces for data models, creation, updates, querying,
 * and paginated API responses matching CampusFlow ERP conventions.
 */

export type FacultyStatus = "ACTIVE" | "INACTIVE";

export interface FacultyUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface FacultyStats {
  total: number;
  active: number;
  inActive: number;
  departments: number;
}

/**
 * Main Faculty entity returned by GET /api/faculties and GET /api/faculties/:id
 */
export interface Faculty {
  id: string;
  facultyId: string;
  userId: string;
  designation: string;
  joiningDate: string;
  phone: string;
  status: FacultyStatus;
  departmentId: string;
  createdAt?: string;
  updatedAt?: string;

  user?: FacultyUser;
  department?: Department;
}

/**
 * Payload sent to POST /api/faculties
 */
export interface FacultyCreateDto {
  userId: string;
  facultyId: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  phone: string;
}

/**
 * Payload sent to PATCH /api/faculties/:id
 * Only administrative fields are allowed to be updated.
 */
export interface FacultyUpdateDto {
  departmentId?: string;
  designation?: string;
  joiningDate?: string;
  phone?: string;
  status?: FacultyStatus;
}

/**
 * Query parameters supported by GET /api/faculties
 */
export interface FacultyQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: FacultyStatus | "";
  departmentId?: string;
}

/**
 * Pagination metadata returned by CampusFlow backend.
 */
export interface FacultyPaginationMeta {
  totalPages: number;
  total: number;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Response structure for GET /api/faculties
 */
export interface FacultyListResponse {
  faculties: Faculty[];
  pagination: FacultyPaginationMeta;
}

/**
 * Eligible Faculty User candidate for creation dropdown
 */
export interface EligibleFacultyUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
