import createHttpError from "http-errors";
import { profileRepository } from "./profile.repository.js";
import { verifyPassword, hashPassword } from "../User/user.utils.js";
import type {
  ChangePasswordDto,
  UpdateProfileDto,
  UserProfileResponseDto,
} from "./profile.dto.js";

export class ProfileService {
  /**
   * Formats database user object into standardized UserProfileResponseDto
   */
  private formatUserProfile(user: NonNullable<Awaited<ReturnType<typeof profileRepository.findUserProfile>>>): UserProfileResponseDto {
    const student = user.student;
    const faculty = user.faculty;

    const phone = user.phone || student?.phone || faculty?.phone || null;
    const address = user.address || student?.address || null;
    const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase() || "CF";

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      verified: user.isVerified,
      initials,
      phone,
      address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      student: student
        ? {
            id: student.id,
            studentId: student.studentId,
            admissionDate: student.admissionDate,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            phone: student.phone,
            address: student.address,
            status: student.status,
            program: {
              id: student.program.id,
              name: student.program.name,
              code: student.program.code,
              department: {
                id: student.program.department.id,
                name: student.program.department.name,
                code: student.program.department.code,
              },
            },
          }
        : null,
      faculty: faculty
        ? {
            id: faculty.id,
            facultyId: faculty.facultyId,
            designation: faculty.designation,
            joiningDate: faculty.joiningDate,
            phone: faculty.phone,
            status: faculty.status,
            department: {
              id: faculty.department.id,
              name: faculty.department.name,
              code: faculty.department.code,
            },
          }
        : null,
    };
  }

  /**
   * Fetch authenticated user's own profile with role-specific details
   */
  public async getOwnProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await profileRepository.findUserProfile(userId);
    if (!user) {
      throw createHttpError(404, "User profile not found");
    }

    return this.formatUserProfile(user);
  }

  /**
   * Update permitted profile fields for the authenticated user
   */
  public async updateOwnProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfileResponseDto> {
    const existing = await profileRepository.findUserProfile(userId);
    if (!existing) {
      throw createHttpError(404, "User profile not found");
    }

    // 1. Update basic user details on User entity (including phone for Admin / all roles)
    const userUpdate: { firstName?: string; lastName?: string; address?: string; phone?: string | null } = {};
    if (dto.firstName) userUpdate.firstName = dto.firstName.trim();
    if (dto.lastName) userUpdate.lastName = dto.lastName.trim();
    if (dto.address !== undefined) userUpdate.address = dto.address.trim();
    if (dto.phone !== undefined) {
      userUpdate.phone = dto.phone.trim() ? dto.phone.trim() : null;
    }

    if (Object.keys(userUpdate).length > 0) {
      await profileRepository.updateUserBasicInfo(userId, userUpdate);
    }

    // 2. Update Student-specific fields if applicable
    if (existing.student && (dto.phone !== undefined || dto.address !== undefined)) {
      const studentUpdate: { phone?: string; address?: string } = {};
      if (dto.phone !== undefined) studentUpdate.phone = dto.phone.trim();
      if (dto.address !== undefined) studentUpdate.address = dto.address.trim();

      if (Object.keys(studentUpdate).length > 0) {
        await profileRepository.updateStudentDetails(userId, studentUpdate);
      }
    }

    // 3. Update Faculty-specific fields if applicable
    if (existing.faculty && dto.phone !== undefined) {
      const facultyUpdate: { phone?: string } = {};
      if (dto.phone) facultyUpdate.phone = dto.phone.trim();

      if (Object.keys(facultyUpdate).length > 0) {
        await profileRepository.updateFacultyDetails(userId, facultyUpdate);
      }
    }

    const updated = await profileRepository.findUserProfile(userId);
    return this.formatUserProfile(updated!);
  }

  /**
   * Securely update password for authenticated user
   */
  public async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const user = await profileRepository.findUserProfile(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const isMatch = await verifyPassword(user.password, dto.currentPassword);
    if (!isMatch) {
      throw createHttpError(401, "Current password does not match our records");
    }

    const newHash = await hashPassword(dto.newPassword);
    await profileRepository.updateUserPassword(userId, newHash);

    return {
      success: true,
      message: "Password changed successfully",
    };
  }
}

export const profileService = new ProfileService();
