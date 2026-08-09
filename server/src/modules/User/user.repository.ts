import type { User } from "../../generated/prisma/client.js";
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
      data : {...data, updatedAt : new Date(Date.now())},
    });
  }
}

export const userRepository = new UserRepository();
