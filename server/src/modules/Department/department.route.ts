import type { Request, Response } from "express";
import { Router } from "express";
import { departmentRepository } from "./department.repository.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

class DepartmentController {
  public getDepartments = asyncHandler(async (_req: Request, res: Response) => {
    const departments = await departmentRepository.findManyActive();
    res.status(200).json(departments);
  });
}

const departmentController = new DepartmentController();
const router = Router();

router.get("/", departmentController.getDepartments);

export default router;
