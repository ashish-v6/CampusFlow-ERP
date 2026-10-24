/**
 * CampusFlow Department Module — Type Definitions
 * 
 * Defines interfaces for data models, creation, updates, querying,
 * and paginated API responses matching CampusFlow ERP conventions.
 */

export type DepartmentStatus = "ACTIVE" | "INACTIVE";

/**
 * Main Department entity returned by the backend API.
 */
export interface Department {
  id: string;
  name: string;
  code: string;
  status: DepartmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload sent to POST /api/departments
 */
export interface DepartmentCreateDto {
  name: string;
  code: string;
}

/**
 * Payload sent to PATCH /api/departments/:id
 */
export interface DepartmentUpdateDto {
  name?: string;
  code?: string;
  status?: DepartmentStatus;
}

/**
 * Query parameters supported by GET /api/departments
 */
export interface DepartmentQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: DepartmentStatus | "";
}

/**
 * Pagination metadata returned by CampusFlow backend.
 */
export interface DepartmentPaginationMeta {
  totalPages: number;
  total: number;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Response structure for GET /api/departments
 */
export interface DepartmentListResponse {
  departments: Department[];
  pagination: DepartmentPaginationMeta;
}

/**
 * Summary metrics for department dashboard stats cards.
 */
export interface DepartmentStats {
  total: number;
  active: number;
  inActive: number;
}
