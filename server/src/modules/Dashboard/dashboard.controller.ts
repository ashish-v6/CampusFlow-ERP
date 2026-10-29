import type { Request, Response } from "express";
import type { IDashboardService } from "./dashboard.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export interface IDashboardController {
  getMetrics: () => Promise<void>;
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
}
