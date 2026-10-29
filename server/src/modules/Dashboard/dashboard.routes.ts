import { Router } from "express";
import { PrismaClient } from "../../generated/prisma/client.js";
import { DashboardRepository } from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";
import { DashboardController } from "./dashboard.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";

export const createDashboardRouter = (prisma: PrismaClient) => {
  const router = Router();

  // 1. Instantiate dependencies (bottom-up)
  const repo = new DashboardRepository(prisma);
  const service = new DashboardService(repo);
  const controller = new DashboardController(service);

  // 2. Mapping routes
  router.get(
    "/overview",
    authenticate,
    authorize("admin","faculty"),
    controller.getMetrics,
  );
  return router;
};
