import type { Request, Response } from "express";
import * as dtos from "./student.dto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { studentService } from "./student.service.js";
import type { User } from "../../middlewares/auth.middlewares.js";

class StudentController {
  public createStudent = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.StudentCreateDto = req.body;

    const result = await studentService.createStudent(dto);

    res.status(201).json({ ...result });
  });
  public updateStudent = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.StudentUpdateDto = req.body;
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: "Invalid student id" });
      return;
    }
    const result = await studentService.updateStudent(id, dto);
    res.status(200).json({ ...result });
  });
  public getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: "Invalid student id" });
      return;
    }
    const currentUser = req.user as User;
    const result = await studentService.getStudentById(id, currentUser);
    if(!result){
        res.status(404).json({message : "Student Not Found"});
        return;
    }
    res.status(200).json({ ...result });
  });
  public findStudents = asyncHandler(async (req : Request, res : Response) => {
    const query = req.validated?.query as dtos.StudentQueryDto;

    const result = await studentService.findStudents(query);

    res.status(200).json(result);

  });

  public getMyStudentProfile = asyncHandler(async (req: Request, res: Response) => {
    const currentUser = req.user as User;
    if (!currentUser || !currentUser.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const result = await studentService.getMyStudentProfile(currentUser.userId);
    res.status(200).json({ ...result });
  });

  public getEligibleUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await studentService.getEligibleUsers();
    res.status(200).json({ users });
  });

  public getStudentStatus = asyncHandler(async (_req: Request, res: Response) => {
    const result = await studentService.getStudentsStatusDetails();
    res.status(200).json({ result });
  });
}

export const studentController = new StudentController();
