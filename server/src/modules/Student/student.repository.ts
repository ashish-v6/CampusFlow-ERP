import type { Student } from "../../generated/prisma/client.js";
import type { StudentCreateInput, StudentUpdateInput } from "../../generated/prisma/models.js";
import prisma from "../../utils/prisma.js";
export class StudentRepository {
  public async create(data: StudentCreateInput): Promise<Student> {
    return prisma.student.create({ data });
  }
  public async findById(id: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { id } });
  }
  public async findByStudentId(studentId : string): Promise<Student | null>{
    return prisma.student.findUnique({where : {studentId}})
  }
  public async findByUserId(userId : string): Promise<Student | null>{
    return prisma.student.findUnique({where : {userId}})
  }
  public async update(id : string, data : StudentUpdateInput) : Promise<Student> {
    return prisma.student.update({
      where : {id},
      data,
    })
  }
}

export const studentRepository = new StudentRepository();
