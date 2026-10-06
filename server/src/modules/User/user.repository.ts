import type { Prisma, User, UserStatus } from "../../generated/prisma/client.js";
import type { Roles } from "../../generated/prisma/enums.js";
import prisma from "../../utils/prisma.js";
import * as dtos from "./user.dto.js";

export class UserRepository {
  public async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  public async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Roles;
    status: UserStatus;
    phone?: string;
    address?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.address ? { address: data.address } : {}),
        isVerified: true,
      },
    });
  }

  public async updateUserProfile(id: string, data: dtos.updateUserProfileDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date(Date.now()) },
    });
  }

  public async updateUserPassword(id: string, password: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password, updatedAt: new Date(Date.now()) },
    });
  }

  public async findUsers(
    skip: number,
    limit: number,
    where: Prisma.UserWhereInput = {},
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { users, total };
  }

  public async findUsersDetails(): Promise<{
    total: number;
    active: number;
    inActive: number;
    suspended: number;
  }> {
    const [total, active, inActive, suspended] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "INACTIVE" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
    ]);
    return { total, active, inActive, suspended };
  }

  public async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  public async findEligibleStudentUsers(): Promise<Array<{ id: string; firstName: string; lastName: string; email: string }>> {
    return prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        student: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
  }

  public async findEligibleFacultyUsers(): Promise<Array<{ id: string; firstName: string; lastName: string; email: string }>> {
    return prisma.user.findMany({
      where: {
        role: "FACULTY",
        status: "ACTIVE",
        faculty: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
  }
}

export const userRepository = new UserRepository();
