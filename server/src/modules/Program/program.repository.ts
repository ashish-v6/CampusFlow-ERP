import type { Prisma, Program } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";

export class ProgramRepository {
  public async findById(id: string) {
    return prisma.program.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  public async findByCode(code: string): Promise<Program | null> {
    return prisma.program.findUnique({
      where: { code },
    });
  }

  public async create(data: Prisma.ProgramCreateInput) {
    return prisma.program.create({
      data,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  public async update(id: string, data: Prisma.ProgramUpdateInput) {
    return prisma.program.update({
      where: { id },
      data,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  public async findMany(
    skip: number,
    limit: number,
    where: Prisma.ProgramWhereInput = {},
  ) {
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          _count: {
            select: {
              students: true,
            },
          },
        },
      }),
      prisma.program.count({ where }),
    ]);

    return { programs, total };
  }

  public async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    const [total, active, inactive] = await Promise.all([
      prisma.program.count(),
      prisma.program.count({ where: { status: "ACTIVE" } }),
      prisma.program.count({ where: { status: "INACTIVE" } }),
    ]);

    return { total, active, inactive };
  }
}

export const programRepository = new ProgramRepository();
