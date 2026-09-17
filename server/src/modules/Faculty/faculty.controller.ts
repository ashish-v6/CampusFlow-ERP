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
  public getFacultyById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await facultyService.getFacultyById(id);

    res.status(200).json({ ...result });
  });
  public getFaculties = asyncHandler(async (req: Request, res: Response) => {
    const query = req.validated?.query as dtos.FacultiesQueryDto;

    const result = await facultyService.getFaculties(query);

    res.status(200).json(result);
  });
  public updateFaculty = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ mesaage: "Id is Missing in Parameters" });
      return;
    }
    const dto: dtos.FacultyUpdateDto = req.body;

    const result = await facultyService.updateFaculty(id, dto);

    res.status(200).json({ ...result });
  });
  public getEligibleUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await facultyService.getEligibleUsers();
    res.status(200).json({ users });
  });
  public getFacultyStatus = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await facultyService.getFacultyStatus();
    res.status(200).json(stats);
  });
}

export const facultyController = new FacultyController();
