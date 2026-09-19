import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dtos from "./attendance.dto.js";
import { attendanceService } from "./attendance.service.js";

export class AttendanceController {
  protected readonly service = attendanceService;
}

export const attendanceController = new AttendanceController();
