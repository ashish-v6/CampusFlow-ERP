import type { Roles, UserStatus } from "../../generated/prisma/enums.js";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Roles;
  status: UserStatus;
  phone?: string;
  address?: string;
}

export interface CureentUserDto {
  id?: string | undefined;
}

export interface updateUserProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface updateUserPasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface getAllUsersDto {
  page: number;
  limit: number;
  search?: string;
  role?: Roles;
  status?: UserStatus;
}
export interface getUserByIdDto {
  id: string;
}

export interface updateStatusDto {
  id: string;
  status: UserStatus;
}
