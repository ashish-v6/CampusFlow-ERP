import type { Faculty } from "../../generated/prisma/client.js";
import type {
  FacultyCreateInput,
  FacultyUpdateInput,
  FacultyWhereInput,
  FacultyWhereUniqueInput,
} from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";
import type { FacultyResponseDTO } from "./faculty.dto.js";

export class FacultyRepository {
  public async create(data: FacultyCreateInput): Promise<Faculty> {
    return prisma.faculty.create({ data });
  }
  public async findByAnyId(where: FacultyWhereUniqueInput): Promise<FacultyResponseDTO | null> {
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
  public async findMany(
    skip: number,
    take: number,
    where: FacultyWhereInput,
  ): Promise<{ faculties: FacultyResponseDTO[]; total: number }> {
    const [faculties, total] = await prisma.$transaction([
      prisma.faculty.findMany({
        where,
        skip,
        take,
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.faculty.count({ where }),
    ]);
    return { faculties, total };
  }
  public async update(id: string, data: FacultyUpdateInput): Promise<Faculty> {
    return prisma.faculty.update({
      where: { id },
      data,
    });
  }
  public async findFacultyStats(): Promise<{ total: number; active: number; inActive: number; departments: number }> {
    const [total, active, inActive, departments] = await prisma.$transaction([
      prisma.faculty.count(),
      prisma.faculty.count({ where: { status: "ACTIVE" } }),
      prisma.faculty.count({ where: { status: "INACTIVE" } }),
      prisma.department.count({ where: { status: "ACTIVE" } }),
    ]);
    return { total, active, inActive, departments };
  }
}

export const facultyRepository = new FacultyRepository();
