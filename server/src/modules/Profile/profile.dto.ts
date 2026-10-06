/**
 * CampusFlow Profile Module — Data Transfer Objects
 */

export interface StudentProfileDto {
  id: string;
  studentId: string;
  admissionDate: Date;
  dateOfBirth: Date | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  program: {
    id: string;
    name: string;
    code: string;
    department: {
      id: string;
      name: string;
      code: string;
    };
  };
}

export interface FacultyProfileDto {
  id: string;
  facultyId: string;
  designation: string;
  joiningDate: Date;
  phone: string;
  status: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
}

export interface UserProfileResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isVerified: boolean;
  verified: boolean;
  initials: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  student?: StudentProfileDto | null;
  faculty?: FacultyProfileDto | null;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
