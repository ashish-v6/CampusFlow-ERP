export interface StudentProfileInfo {
  id: string;
  studentId: string;
  admissionDate: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  phone?: string | null;
  address?: string | null;
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

export interface FacultyProfileInfo {
  id: string;
  facultyId: string;
  designation: string;
  joiningDate: string;
  phone: string;
  status: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  isVerified?: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  initials: string;
  phone?: string | null;
  address?: string | null;
  student?: StudentProfileInfo | null;
  faculty?: FacultyProfileInfo | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
