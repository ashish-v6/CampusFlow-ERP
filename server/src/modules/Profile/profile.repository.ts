import prisma from "../../utils/prisma.js";

export class ProfileRepository {
  /**
   * Fetch complete user profile with role-specific student or faculty relations
   */
  public async findUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            program: {
              include: {
                department: true,
              },
            },
          },
        },
        faculty: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  /**
   * Update User table basic details (firstName, lastName)
   */
  public async updateUserBasicInfo(
    userId: string,
    data: { firstName?: string; lastName?: string; address?: string },
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.address !== undefined && { address: data.address }),
      },
    });
  }

  /**
   * Update Student-specific profile fields (phone, address)
   */
  public async updateStudentDetails(
    userId: string,
    data: { phone?: string; address?: string },
  ) {
    return prisma.student.update({
      where: { userId },
      data: {
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
      },
    });
  }

  /**
   * Update Faculty-specific profile fields (phone)
   */
  public async updateFacultyDetails(
    userId: string,
    data: { phone?: string },
  ) {
    return prisma.faculty.update({
      where: { userId },
      data: {
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    });
  }

  /**
   * Update password hash on User entity
   */
  public async updateUserPassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
