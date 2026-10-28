import { Router } from "express";
import { attendanceController } from "./attendance.controller.js";
import { authorize, authenticate } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { attendanceSchema } from "./attendance.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.markAttendance, "body"),
  attendanceController.markAttendance,
);

router.post(
  "/bulk",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.bulkMarkAttendance, "body"),
  attendanceController.markBulkAttendance,
);

router.get(
  "/summary",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.attendanceStatsSchema, "query"),
  attendanceController.fetchSummary,
);

router.get(
  "/stats",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.attendanceStatsSchema, "query"),
  attendanceController.fetchStats,
);

router.get(
  "/me",
  authenticate,
  authorize("student"),
  validateSchema(attendanceSchema.attendanceQuerySchema, "query"),
  attendanceController.fetchMyAttendance,
);

router.get(
  "/",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.attendanceQuerySchema, "query"),
  attendanceController.fetchAttendances,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.attendanceById, "params"),
  attendanceController.fetchById,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.attendanceById, "params"),
  validateSchema(attendanceSchema.updateAttendance, "body"),
  attendanceController.update,
);

export default router;
