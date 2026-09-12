import { StudentRepository } from "./student.repository.js";
import { userRepository } from "../User/user.repository.js";
import * as dtos from "./student.dto.js";
import createHttpError from "http-errors";
import { programRepository } from "../Program/program.repositroy.js";
import type { StudentCreateInput, StudentUpdateInput } from "../../generated/prisma/models.js";

class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}
  public async createStudent(dto: dtos.StudentCreateDto) {
    const user = await userRepository.findUserById(dto.userId);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (user.status !== "ACTIVE") {
      throw createHttpError(403, "User is inactive");
    }

    if (user.role !== "STUDENT") {
      throw createHttpError(400, "User role is not STUDENT");
    }

    const existingStudent = await this.studentRepository.findByStudentId(dto.studentId);

    if (existingStudent) {
      throw createHttpError(409, "Student ID already exists");
    }

    const existingStudentForUser = await this.studentRepository.findByUserId(dto.userId);

    if (existingStudentForUser) {
      throw createHttpError(409, "User is already registered as a student");
    }

    const program = await programRepository.findById(dto.programId);

    if (!program) {
      throw createHttpError(404, "Program not Found");
    }

    if (program.status !== "ACTIVE") {
      throw createHttpError(403, "program is inactive");
    }

    const data: StudentCreateInput = {
      studentId: dto.studentId,
      admissionDate: dto.admissionDate,
      ...(dto.dateOfBirth !== undefined && {
        dateOfBirth: dto.dateOfBirth,
      }),

      ...(dto.gender !== undefined && {
        gender: dto.gender,
      }),

      ...(dto.phone !== undefined && {
        phone: dto.phone,
      }),

      ...(dto.address !== undefined && {
        address: dto.address,
      }),
      user: { connect: { id: dto.userId } },
      program: { connect: { id: dto.programId } },
    };

    const student = await this.studentRepository.create(data);
    return student;
  }

  public async updateStudent(id : string, dto: dtos.StudentUpdateDto) {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw createHttpError(404, "Student Not Found");
    }
    if (dto.programId) {
      const program = await programRepository.findById(dto.programId);
      if (!program) {
        throw createHttpError(404, "Program Not Found");
      }
      if (program.status === "INACTIVE") {
        throw createHttpError(403, "Unable to change as program is inactive");
      }
    }
    const updateStudent : StudentUpdateInput = {
      ...(dto.programId !== undefined && {
        program : {connect : {id : dto.programId}}
      }),
      ...(dto.address !== undefined && {
        address: dto.address,
      }),
      ...(dto.gender !== undefined && {
        gender : dto.gender
      }),
      ...(dto.phone !== undefined && {
        phone : dto.phone
      }),
      ...(dto.dateOfBirth !== undefined && {
        dateOfBirth : dto.dateOfBirth
      }),
      ...(dto.status !== undefined && {
        status : dto.status
      })
    }

    const updatedStudent = await this.studentRepository.update(id, updateStudent);

    return updatedStudent;
  }
}

export const studentService = new StudentService(new StudentRepository());
