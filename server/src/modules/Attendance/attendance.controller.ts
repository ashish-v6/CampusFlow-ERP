import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dtos from "./attendance.dto.js";
import { attendanceService } from "./attendance.service.js";

export class AttendanceController {
  protected readonly service = attendanceService;
  markAttendance = asyncHandler(async (req: Request, res: Response) => {
    const dto : dtos.markAttendance = req.body;

    const result = await this.service.markAttendance(dto);

    res.status(200).json({
      result
    })
  });
}

export const attendanceController = new AttendanceController();
