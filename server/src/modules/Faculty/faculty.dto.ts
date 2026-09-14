import type {
  DepartmentStatus,
  FacultyStatus,
  Roles,
} from "../../generated/prisma/enums.js";

export interface CreateFacultyDTO {
  userId: string;
  facultyId: string;
  departmentId: string;
  designation: string;
  joiningDate: Date;
  phone: string;
}

export interface GetFacultyByIdDTO {
  id: string;
}

export interface FacultyResponseDTO {
  id: string;
  facultyId: string;
  userId: string;
  designation: string;
  joiningDate: Date;
  phone: string;
  status: FacultyStatus;
  departmentId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: Roles;
  };
  department: {
    name: string;
    code: string;
    status: DepartmentStatus;
  };
}

export interface FacultiesQueryDto {
  page: number;
  limit: number;
  search?: string;
  departmentId?: string;
  status?: FacultyStatus;
}
