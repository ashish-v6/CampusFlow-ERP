import type { User, UserStatus } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";
import * as dtos from "./user.dto.js";

export class UserRepository {
  public async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
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

  public async findUsers(skip: number, limit: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count(),
    ]);
    return { users, total };
  }

  public async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}

export const userRepository = new UserRepository();
