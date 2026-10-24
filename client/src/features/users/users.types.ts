export interface Users {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  initials: string;
}

export interface UserStats {
  total: number;
  active: number;
  inActive: number;
  suspended: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserPagination {
  page: number;
  limit: number;
}

export interface Params {
  page: string;
  limit: string;
}

export type Status = "ACTIVE" | "SUSPENDED";

export interface ActivityLogItem {
  id: number;
  action: string;
  date: string;
}
