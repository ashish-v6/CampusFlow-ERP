import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { dashboardController } from "./dashboard.controller.js";
import { dashboardSchema } from "./dashboard.schema.js";

const router = Router();

/**
 * GET /api/dashboard
 * Authenticated ERP dashboard metrics for Admin, Faculty, and Student roles.
 * Supports optional query filters: startDate, endDate, departmentId
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "faculty", "student"),
  validateSchema(dashboardSchema.dashboardQuerySchema, "query"),
  dashboardController.getDashboard,
);

export default router;
