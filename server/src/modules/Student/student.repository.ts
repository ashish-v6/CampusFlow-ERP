import type { Prisma, Student } from "../../generated/prisma/client.js";
import type { StudentCreateInput, StudentUpdateInput } from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";
import type { StudentResponseDto } from "./student.dto.js";
export class StudentRepository {
  public async create(data: StudentCreateInput): Promise<Student> {
    return prisma.student.create({ data });
  }
  public async findById(id: string): Promise<StudentResponseDto | null> {
    return prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        studentId: true,
        status: true,
        admissionDate: true,
        dateOfBirth: true,
        address: true,
        gender: true,
        phone: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        program: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }
  public async findByStudentId(studentId: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { studentId } });
  }
  public async findByUserId(userId: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { userId } });
  }
  public async findDetailByUserId(userId: string): Promise<StudentResponseDto | null> {
    return prisma.student.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        studentId: true,
        status: true,
        admissionDate: true,
        dateOfBirth: true,
        address: true,
        gender: true,
        phone: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        program: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }
  public async update(id: string, data: StudentUpdateInput): Promise<Student> {
    return prisma.student.update({
      where: { id },
      data,
    });
  }
  public async findMany(
    skip: number,
    limit: number,
    where : Prisma.StudentWhereInput
  ): Promise<{ students: StudentResponseDto[]; total: number }> {
    const [students, total] = await prisma.$transaction([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
          studentId: true,
          status: true,
          admissionDate: true,
          dateOfBirth: true,
          address: true,
          gender: true,
          phone: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          program: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      prisma.student.count({where}),
    ]);

    return { students, total };
  }

  public async findStudentsDetails(): Promise<{
    total: number;
    active: number;
    inActive: number;
    programs: number;
  }> {
    const [total, active, inActive, programs] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: "ACTIVE" } }),
      prisma.student.count({ where: { status: "INACTIVE" } }),
      prisma.program.count({ where: { status: "ACTIVE" } }),
    ]);
    return { total, active, inActive, programs };
  }
}

export const studentRepository = new StudentRepository();
