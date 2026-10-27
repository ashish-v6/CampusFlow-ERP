import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dtos from "./attendance.dto.js";
import { attendanceService } from "./attendance.service.js";

export class AttendanceController {
  protected readonly service = attendanceService;
  public markAttendance = asyncHandler(async (req: Request, res: Response) => {
    const dto : dtos.markAttendance = req.body;

    const result = await this.service.markAttendance(dto);

    res.status(201).json({
      result
    })
  });
  public fetchAttendances = asyncHandler(async(req:Request, res:Response) =>{
    const dto  = req.validated?.query as dtos.AttendanceQueryDto;

    const result = await this.service.fetchAll(dto);

    res.status(200).json({
      ...result
    })

  })
}

export const attendanceController = new AttendanceController();
