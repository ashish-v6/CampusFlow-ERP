import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dtos from "./faculty.dto.js";
import { facultyService } from "./faculty.service.js";

class FacultyController {
  public createFaculty = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.CreateFacultyDTO = req.body;

    const result = await facultyService.createFaculty(dto);

    res.status(201).json({ ...result });
  });
}

export const facultyController = new FacultyController();
