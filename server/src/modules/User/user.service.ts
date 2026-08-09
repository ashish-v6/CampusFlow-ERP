import { UserRepository } from "./user.repository.js";
import * as dtos from "./user.dto.js";
import createHttpError from "http-errors";

class UserServices {
  constructor(private readonly userRepository: UserRepository) {}

  public async getCurrentUser(id: string) {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw createHttpError(404, "Invalid Request");
    }
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return safeUser;
  }

  public async updateUserProfile(id: string, dto: dtos.updateUserProfileDto) {
    const existingUser = await this.userRepository.findUserById(id);
    
    if (!existingUser) {
      throw createHttpError(404, "Invalid Request");
    }
    const updateUser = await this.userRepository.updateUserProfile(id, dto);
    const safeUser = {
      ...updateUser,
      password: "",
      createdAt: "",
      role: "",
    };
    return safeUser;
  }
}

export const userServices = new UserServices(new UserRepository());
