import { DepartmentRepository } from "./department.repository.js";
import * as dtos from "./department.dto.js";
import createHttpError from "http-errors";
import type { DepartmentWhereInput } from "../../generated/prisma/models.js";

export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}
  public async createDepartment(dto: dtos.CreateDepartmentDto) {
    if (await this.departmentRepository.findUnique({ code: dto.code })) {
      throw createHttpError(409, "Department already exists");
    }
    const dept = await this.departmentRepository.create(dto);
    return dept;
  }

  public async getDepartmentById(id: string) {
    const dept = await this.departmentRepository.findUnique({ id });
    if (!dept) {
      throw createHttpError(404, "Department not found");
    }
    return dept;
  }

  public async getDepartments(query: dtos.DepartmentQueryDto) {
    //pagination
    const { page, limit, search, status } = query;
    const skip = (page - 1) * limit;

    //filters
    const where: DepartmentWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const { departments, total } = await this.departmentRepository.findMany(skip, limit, where);
    const totalPages = Math.ceil(total / limit);
    return {
      departments,
      pagination: {
        total,
        totalPages,
        limit,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  public async updateDepartment(id: string, dto: dtos.UpdateDepartmentDto) {
    const deptExists = await this.departmentRepository.findUnique({ id });

    if (!deptExists) {
      throw createHttpError(404, "Department not found");
    }
    if (dto.code) {
      const duplicateDept = await this.departmentRepository.findUnique({ code: dto.code });
      if (duplicateDept && duplicateDept.id !== deptExists.id) {
        throw createHttpError(409, "Department code is used");
      }
    }

    if (dto.status && dto.status === "INACTIVE" && deptExists.status === "ACTIVE") {
      return this.departmentRepository.deactivateDepartment(id, dto);
    }
    return this.departmentRepository.update(id, dto);
  }
}

export const departmentService = new DepartmentService(new DepartmentRepository());
