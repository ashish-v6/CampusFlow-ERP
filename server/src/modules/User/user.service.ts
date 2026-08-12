import { UserRepository } from "./user.repository.js";
import * as dtos from "./user.dto.js";
import createHttpError from "http-errors";
import * as utils from "./user.utils.js";

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

  public async updateUserPassword(id: string, dto: dtos.updateUserPasswordDto) {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw createHttpError(404, "Invalid Request");
    }

    const checkPassword = await utils.verifyPassword(existingUser.password, dto.currentPassword);
    if (!checkPassword) {
      throw createHttpError(401, "Invalid password");
    }
    const password = await utils.hashPassword(dto.newPassword);
    await this.userRepository.updateUserPassword(id, password);

    return;
  }

  public async getAllUsers(dto: dtos.getAllUsersDto) {
    const skip = (dto.page - 1) * dto.limit;

    const result = await this.userRepository.findUsers(skip, dto.limit);

    const totalPages = Math.ceil(result.total / dto.limit);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeUsers = result.users.map(({ password, ...user }) => user);

    if (!safeUsers.length) {
      throw createHttpError(404, "User not found");
    }

    return {
      users: safeUsers,
      pagination: {
        page: dto.page,
        limit: dto.limit,
        total: result.total,
        totalPages,
      },
    };
  }

  public async getUserById(dto: dtos.getUserByIdDto) {
    const user = await this.userRepository.findUserById(dto.id);

    if (!user) {
      throw createHttpError(404, "invalid Request");
    }

    const safeUser = {
      ...user,
      password: "",
    };

    return safeUser;
  }

  public async updateUserStatus(dto: dtos.updateStatusDto) {
    const user = await this.userRepository.findUserById(dto.id);

    if (!user || user.role === "ADMIN") {
      throw createHttpError(404, "Invalid Request");
    }

    await this.userRepository.updateUserStatus(dto.id, dto.status);

    return {
      success: true,
      message: "Status Update Successful",
    };
  }
}

export const userServices = new UserServices(new UserRepository());
