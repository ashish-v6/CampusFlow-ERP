import type { Faculty } from "../../generated/prisma/client.js";
import type {
  FacultyCreateInput,
  FacultyWhereInput,
  FacultyWhereUniqueInput,
} from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";
import type { FacultyResponseDTO } from "./faculty.dto.js";

export class FacultyRepository {
  public async create(data: FacultyCreateInput): Promise<Faculty> {
    return prisma.faculty.create({ data });
  }
  public async findByAnyId(
    where: FacultyWhereUniqueInput,
  ): Promise<FacultyResponseDTO | null> {
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
  public async findMany(skip: number, take: number, where: FacultyWhereInput) {
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
        orderBy : {
            createdAt : "desc"
        }
      }),
      prisma.faculty.count({ where }),
    ]);
    return {faculties, total}
  }
}

export const facultyRepository = new FacultyRepository();
