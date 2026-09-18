import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dtos from "./department.dto.js";
import { departmentService } from "./department.service.js";

class DepartmentController {
  public createDepartment = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.CreateDepartmentDto = req.body;
    const result = await departmentService.createDepartment(dto);
    res.status(201).json(result);
  });

  public getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ message: "Id is missing" });
    }
    const result = await departmentService.getDepartmentById(id);
    res.status(200).json(result);
  });

  public getDepartments = asyncHandler(async (req: Request, res: Response) => {
    const query = req.validated?.query as dtos.DepartmentQueryDto;
    const result = await departmentService.getDepartments(query);
    res.status(200).json(result);
  });

  public updateDepartment = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ message: "Id is missing" });
    }
    const dto: dtos.UpdateDepartmentDto = req.body;
    const result = await departmentService.updateDepartment(id, dto);
    res.status(200).json(result);
  });
}

export const departmentController = new DepartmentController();
