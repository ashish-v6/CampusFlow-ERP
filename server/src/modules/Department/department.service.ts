import { DepartmentRepository, departmentRepository } from "./department.repository.js";

export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}
}

export const departmentService = new DepartmentService(departmentRepository);
