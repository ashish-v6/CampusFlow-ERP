import type { Department } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";

export class DepartmentRepository {
  public async findById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({ where: { id } });
  }

  public async findManyActive(): Promise<Department[]> {
    return prisma.department.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
  }
}

export const departmentRepository = new DepartmentRepository();
