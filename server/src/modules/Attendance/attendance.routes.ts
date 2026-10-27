import { Router } from "express";
import { attendanceController } from "./attendance.controller.js";
import { authorize, authenticate } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { attendanceSchema } from "./attendance.schema.js";

const router = Router();

router.post(
  "/",
  validateSchema(attendanceSchema.markAttendance, "body"),
  attendanceController.markAttendance,
  authenticate,
  authorize("admin", "faculty"),
);

router.get(
  "/",
  validateSchema(attendanceSchema.attendanceQuerySchema, "query"),
  attendanceController.fetchAttendances,
  authenticate,
  authorize("admin", "faculty"),
);

router.get(
  "/:id",
  validateSchema(attendanceSchema.attendanceById, "params"),
  attendanceController.fetchById,
  // authenticate,
);

router.patch(
  "/:id",
  validateSchema(attendanceSchema.attendanceById, "params"),
  validateSchema(attendanceSchema.updateAttendance, "body"),
  attendanceController.update,
  //  authenticate,
  // authorize("admin", "faculty"),
);
export default router;
