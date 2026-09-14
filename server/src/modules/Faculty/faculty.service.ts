import createHttpError from "http-errors";
import { departmentRepository } from "../Department/department.repository.js";
import { userRepository } from "../User/user.repository.js";
import type { FacultyUpdateInput, FacultyWhereInput } from "../../generated/prisma/models.js";
import * as dtos from "./faculty.dto.js";
import { FacultyRepository } from "./faculty.repository.js";

class FacultyService {
  constructor(private readonly facultyRepository: FacultyRepository) {}
  public async createFaculty(dto: dtos.CreateFacultyDTO) {
    const user = await userRepository.findUserById(dto.userId);
    if (!user) {
      throw createHttpError(404, "User Not Found");
    }
    if (user.status !== "ACTIVE") {
      throw createHttpError(403, "The account is not Active");
    }
    if (user.role !== "FACULTY") {
      throw createHttpError(400, `${user.role} is not allowed to be Faculty`);
    }

    if (await this.facultyRepository.findByAnyId({ userId: dto.userId })) {
      throw createHttpError(409, "User already has a Faculty profile");
    }
    if (await this.facultyRepository.findByAnyId({ facultyId: dto.facultyId })) {
      throw createHttpError(409, "Faculty ID is already in use");
    }

    const department = await departmentRepository.findById(dto.departmentId);
    if (!department) {
      throw createHttpError(404, "Department Not Found");
    }
    if (department.status !== "ACTIVE") {
      throw createHttpError(403, "Department is not Active");
    }

    return this.facultyRepository.create({
      facultyId: dto.facultyId,
      designation: dto.designation,
      joiningDate: dto.joiningDate,
      phone: dto.phone,
      user: { connect: { id: dto.userId } },
      department: { connect: { id: dto.departmentId } },
    });
  }

  public async getFacultyById(id: string) {
    const faculty = await this.facultyRepository.findByAnyId({ id });

    if (!faculty) {
      throw createHttpError(404, "Not Faculty Record Found");
    }

    return faculty;
  }

  public async getFaculties(query: dtos.FacultiesQueryDto) {
    //pagination
    const { page = 1, limit = 10, status, departmentId, search } = query;
    const skip = (page - 1) * limit;

    //filters
    const where: FacultyWhereInput = {};
    if (status) {
      where.status = status;
    }
    console.log(status);
    if (departmentId) {
      where.departmentId = departmentId;
    }
    if (search) {
      where.OR = [
        {
          facultyId: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }
    const { faculties, total } = await this.facultyRepository.findMany(skip, limit, where);
    const totalPages = Math.ceil(total / limit);

    return {
      faculties,
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
  public async updateFaculty(id: string, dto: dtos.FacultyUpdateDto) {
    if (!(await this.facultyRepository.findByAnyId({ id }))) {
      throw createHttpError(404, "Faculty not found");
    }
    const data: FacultyUpdateInput = {};
    if (dto.departmentId !== undefined) {
      data.department = { connect: { id: dto.departmentId } };
    }
    if (dto.designation !== undefined) {
      data.designation = dto.designation;
    }
    if (dto.joiningDate !== undefined) {
      data.joiningDate = dto.joiningDate;
    }
    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }
    const faculty = await this.facultyRepository.update(id, data);

    return faculty;
  }

  public async getEligibleUsers() {
    return userRepository.findEligibleFacultyUsers();
  }

  public async getFacultyStatus() {
    return this.facultyRepository.findFacultyStats();
  }
}

export const facultyService = new FacultyService(new FacultyRepository());
