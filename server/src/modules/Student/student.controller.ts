import type { Request, Response } from "express";
import * as dtos from "./student.dto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { studentService } from "./student.service.js";

class StudentController {
    public createStudent = asyncHandler(async (req : Request, res : Response) => {
        const dto : dtos.StudentCreateDto = req.body;
        
        const result = await studentService.createStudent(dto);

        res.status(201).json({...result});
    })
}

export const studentController = new StudentController();
