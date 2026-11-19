import type { Request, Response } from "express";
import type { IDashboardService } from "./dashboard.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dtos from "./dashboard.dto.js";

export interface IDashboardController {
  getMetrics: () => Promise<void>;
  getAttendacneTrends : () => Promise<void>;
  getDepartmentStats : () => Promise<void>;
}

export class DashboardController {
  constructor(private readonly dashboardService: IDashboardService) {}

  public getMetrics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.dashboardService.getOverview();
    res.status(200).json({
      message: "Dashboard metrics retrieved successfully",
      ...result,
    });
  });

  public getAttendanceTrends = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = req.validated?.query as dtos.AttendanceTrendsDto;
    const data = await this.dashboardService.getAttendanceTrends(dto);
    res.status(200).json({
      ...data
    })
  });

  public getDepartmentStats = asyncHandler(async ( req : Request, res : Response) : Promise<void> => {
    const dto = req.validated?.query as dtos.DepartmentStatsDTO;
    const data = await this.dashboardService.getDepartmentStats(dto);
    res.status(200).json({
      ...data
    })
  })
}
