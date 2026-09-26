import createHttpError from "http-errors";
import type { Prisma } from "../../generated/prisma/client.js";
import { departmentRepository } from "../Department/department.repository.js";
import type * as dtos from "./program.dto.js";
import { ProgramRepository, programRepository } from "./program.repository.js";

export class ProgramService {
  constructor(private readonly programRepository: ProgramRepository) {}

  public async createProgram(dto: dtos.CreateProgramDto) {
    // 1. Verify department exists and is active
    const department = await departmentRepository.findUnique({ id: dto.departmentId });
    if (!department) {
      throw createHttpError(404, "Department not found");
    }
    if (department.status !== "ACTIVE") {
      throw createHttpError(400, "Cannot create a program under an inactive department");
    }

    // 2. Verify unique code
    const normalizedCode = dto.code.trim().toUpperCase();
    const existingCode = await this.programRepository.findByCode(normalizedCode);
    if (existingCode) {
      throw createHttpError(409, `Program code '${normalizedCode}' is already in use`);
    }

    // 3. Create program
    return this.programRepository.create({
      name: dto.name.trim(),
      code: normalizedCode,
      status: dto.status || "ACTIVE",
      department: { connect: { id: dto.departmentId } },
    });
  }

  public async getPrograms(query: dtos.ProgramQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProgramWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { code: { contains: term, mode: "insensitive" } },
      ];
    }

    const { programs, total } = await this.programRepository.findMany(skip, limit, where);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      programs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  public async getProgramById(id: string) {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw createHttpError(404, "Program not found");
    }
    return program;
  }

  public async updateProgram(id: string, dto: dtos.UpdateProgramDto) {
    const existing = await this.programRepository.findById(id);
    if (!existing) {
      throw createHttpError(404, "Program not found");
    }

    // If code is being updated, ensure uniqueness
    let normalizedCode: string | undefined;
    if (dto.code && dto.code.trim().toUpperCase() !== existing.code) {
      normalizedCode = dto.code.trim().toUpperCase();
      const duplicate = await this.programRepository.findByCode(normalizedCode);
      if (duplicate && duplicate.id !== id) {
        throw createHttpError(409, `Program code '${normalizedCode}' is already in use`);
      }
    }

    // If departmentId is being updated, verify target department
    if (dto.departmentId && dto.departmentId !== existing.departmentId) {
      const department = await departmentRepository.findUnique({ id: dto.departmentId });
      if (!department) {
        throw createHttpError(404, "Target department not found");
      }
      if (department.status !== "ACTIVE") {
        throw createHttpError(400, "Cannot transfer program to an inactive department");
      }
    }

    const updateData: Prisma.ProgramUpdateInput = {
      ...(dto.name && { name: dto.name.trim() }),
      ...(normalizedCode && { code: normalizedCode }),
      ...(dto.status && { status: dto.status }),
      ...(dto.departmentId && { department: { connect: { id: dto.departmentId } } }),
    };

    return this.programRepository.update(id, updateData);
  }

  public async getProgramStats() {
    return this.programRepository.getStats();
  }
}

export const programService = new ProgramService(programRepository);
