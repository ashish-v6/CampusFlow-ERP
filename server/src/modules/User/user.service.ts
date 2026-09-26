import { UserRepository } from "./user.repository.js";
import * as dtos from "./user.dto.js";
import createHttpError from "http-errors";
import * as utils from "./user.utils.js";
import { profileService } from "../Profile/profile.service.js";

import type { Prisma } from "../../generated/prisma/client.js";

class UserServices {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(dto: dtos.CreateUserDto) {
    const existing = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
    if (existing) {
      throw createHttpError(409, "A user with this email address already exists");
    }

    const hashedPassword = await utils.hashPassword(dto.password);
    const user = await this.userRepository.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      role: dto.role,
      status: dto.status,
      ...(dto.address ? { address: dto.address.trim() } : {}),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

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
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (dto.role) {
      where.role = dto.role;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.search && dto.search.trim()) {
      const term = dto.search.trim();
      where.OR = [
        { firstName: { contains: term, mode: "insensitive" } },
        { lastName: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
      ];
    }

    const result = await this.userRepository.findUsers(skip, limit, where);
    const totalPages = Math.ceil(result.total / limit) || 1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeUsers = result.users.map(({ password, ...user }) => user);

    return {
      users: safeUsers,
      pagination: {
        page,
        limit,
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
