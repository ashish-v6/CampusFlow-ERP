import type { Request, Response } from "express";
import type { User } from "../../middlewares/auth.middlewares.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type * as dtos from "./attendance.dto.js";
import { attendanceService } from "./attendance.service.js";

export class AttendanceController {
  public markAttendance = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.MarkAttendanceDto = req.body;
    const currentUser = req.user as User;

    const result = await attendanceService.markAttendance(dto, currentUser);
    res.status(201).json(result);
  });

  public bulkMarkAttendance = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.BulkMarkAttendanceDto = req.body;
    const currentUser = req.user as User;

    const result = await attendanceService.bulkMarkAttendance(dto, currentUser);
    res.status(201).json(result);
  });

  public updateAttendance = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const dto: dtos.UpdateAttendanceDto = req.body;

    const result = await attendanceService.updateAttendance(id, dto);
    res.status(200).json(result);
  });

  public getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const currentUser = req.user as User;

    const result = await attendanceService.getAttendanceById(id, currentUser);
    res.status(200).json(result);
  });

  public findAttendances = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.validated?.query || {}) as dtos.AttendanceQueryDto;
    const currentUser = req.user as User;

    const result = await attendanceService.findAttendances(query, currentUser);
    res.status(200).json(result);
  });

  public getStudentSummary = asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.params.studentId as string;
    const currentUser = req.user as User;
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

    const dateFilter: { startDate?: Date; endDate?: Date } = {};
    if (startDate) dateFilter.startDate = new Date(startDate);
    if (endDate) dateFilter.endDate = new Date(endDate);

    const result = await attendanceService.getStudentAttendanceSummary(
      studentId,
      currentUser,
      Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    );
    res.status(200).json(result);
  });

  public getMySummary = asyncHandler(async (req: Request, res: Response) => {
    const currentUser = req.user as User;
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

    const dateFilter: { startDate?: Date; endDate?: Date } = {};
    if (startDate) dateFilter.startDate = new Date(startDate);
    if (endDate) dateFilter.endDate = new Date(endDate);

    const result = await attendanceService.getStudentAttendanceSummary(
      "me",
      currentUser,
      Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    );
    res.status(200).json(result);
  });

  public getDepartmentOverview = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId as string;

    const result = await attendanceService.getDepartmentOverview(departmentId);
    res.status(200).json(result);
  });
}

export const attendanceController = new AttendanceController();
