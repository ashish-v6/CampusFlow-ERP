import type { Faculty } from "../../generated/prisma/client.js";
import type { FacultyCreateInput, FacultyWhereUniqueInput } from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";

export class FacultyRepository {
  public async create(data: FacultyCreateInput): Promise<Faculty> {
    return prisma.faculty.create({ data });
  }
  public async findByAnyId(where: FacultyWhereUniqueInput) {
    return prisma.faculty.findUnique({
      where,
      select: {
        id: true,
        facultyId: true,
        userId: true,
        designation: true,
        joiningDate: true,
        phone: true,
        status: true,
        departmentId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
            status: true,
          },
        },
      },
    });
  }
}

export const facultyRepository = new FacultyRepository();
