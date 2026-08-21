import { StudentRepository } from "./student.repository.js";
import * as dtos from "./student.dto.js";
import createHttpError from "http-errors";

class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}
}

export const studentService = new StudentService(new StudentRepository());
