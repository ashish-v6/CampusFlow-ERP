import type {
  DepartmentCreateInput,
  DepartmentUpdateInput,
  DepartmentWhereInput,
  DepartmentWhereUniqueInput,
} from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";
import type { DepartmentListResponseDto, DepartmentResponseDto } from "./department.dto.js";

export class DepartmentRepository {
  public async create(data: DepartmentCreateInput): Promise<DepartmentResponseDto> {
    return prisma.department.create({
      data,
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
      },
    });
  }

  public async findUnique(
    where: DepartmentWhereUniqueInput,
  ): Promise<DepartmentResponseDto | null> {
    return prisma.department.findUnique({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
      },
    });
  }

  public async findMany(
    skip: number,
    take: number,
    filter: DepartmentWhereInput,
  ): Promise<DepartmentListResponseDto> {
    const [departments, total] = await prisma.$transaction([
      prisma.department.findMany({
        skip,
        take,
        where: filter,
        select: {
          id: true,
          name: true,
          code: true,
          status: true,
        },
      }),
      prisma.department.count({ where: filter }),
    ]);
    return { departments, total };
  }
  public async update(id: string, data: DepartmentUpdateInput): Promise<DepartmentResponseDto> {
    return prisma.department.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
      },
    });
  }

  public async deactivateDepartment(
    id: string,
    data: DepartmentUpdateInput,
  ): Promise<DepartmentResponseDto> {
    return prisma.$transaction(async (tx) => {
      await tx.program.updateMany({
        data: {
          status: "INACTIVE",
        },
        where: {
          departmentId: id,
        },
      });
      return await tx.department.update({
        where: {
          id,
        },
        data,
        select: {
          id: true,
          name: true,
          code: true,
          status: true,
        },
      });
    });
  }
}

export const departmentRepository = new DepartmentRepository();
