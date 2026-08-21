import type { Request, Response } from "express";
import * as dtos from "./student.dto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { studentService } from "./student.service.js";

class StudentController {}

export const studentController = new StudentController();
