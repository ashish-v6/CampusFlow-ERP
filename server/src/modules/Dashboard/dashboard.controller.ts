import type { Request, Response } from "express";
import type { User } from "../../middlewares/auth.middlewares.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { DashboardQueryDto } from "./dashboard.dto.js";
import { dashboardService } from "./dashboard.service.js";

export class DashboardController {
  public getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.validated?.query || req.query || {}) as DashboardQueryDto;
    const currentUser = req.user as User;

    const result = await dashboardService.getDashboardData(query, currentUser);
    res.status(200).json(result);
  });
}

export const dashboardController = new DashboardController();
