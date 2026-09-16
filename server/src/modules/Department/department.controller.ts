import type { Request, Response } from "express";
import { departmentRepository } from "./department.repository.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

class DepartmentController {
  public getDepartments = asyncHandler(async (_req: Request, res: Response) => {
    const departments = await departmentRepository.findManyActive();
    res.status(200).json(departments);
  });
}

export const departmentController = new DepartmentController();