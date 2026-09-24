import { UserRepository } from "./user.repository.js";
import * as dtos from "./user.dto.js";
import createHttpError from "http-errors";
import * as utils from "./user.utils.js";
import { profileService } from "../Profile/profile.service.js";

class UserServices {
  constructor(private readonly userRepository: UserRepository) {}

  public async getCurrentUser(id: string) {
    return profileService.getOwnProfile(id);
  }

  public async updateUserProfile(id: string, dto: dtos.updateUserProfileDto) {
    return profileService.updateOwnProfile(id, dto);
  }

  public async updateUserPassword(id: string, dto: dtos.updateUserPasswordDto) {
    return profileService.changePassword(id, dto);
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

  public async getUsersStautsDetails() {
    const result = await this.userRepository.findUsersDetails();
    return {
      total: result.total ?? 0,
      active: result.active ?? 0,
      inActive: result.inActive ?? 0,
      suspended: result.suspended ?? 0,
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
      initials: `${user.firstName[0]}${user.lastName[0]}`,
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
