import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { attendanceController } from "./attendance.controller.js";
import { attendanceSchema } from "./attendance.schema.js";

const router = Router();

// 1. Mark attendance for single student (ADMIN, FACULTY)
router.post(
  "/",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.markAttendanceSchema, "body"),
  attendanceController.markAttendance,
);

// 2. Mark attendance in bulk (ADMIN, FACULTY)
router.post(
  "/bulk",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.bulkMarkAttendanceSchema, "body"),
  attendanceController.bulkMarkAttendance,
);

// 3. Logged-in student's own attendance summary (STUDENT)
router.get(
  "/my-summary",
  authenticate,
  authorize("student"),
  attendanceController.getMySummary,
);

// 4. Attendance summary for a specific student (ADMIN, FACULTY, STUDENT)
router.get(
  "/summary/student/:studentId",
  authenticate,
  authorize("admin", "faculty", "student"),
  validateSchema(attendanceSchema.studentSummaryParamSchema, "params"),
  attendanceController.getStudentSummary,
);

// 5. Department aggregate overview (ADMIN, FACULTY)
router.get(
  "/overview/department/:departmentId",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.departmentOverviewParamSchema, "params"),
  attendanceController.getDepartmentOverview,
);

// 6. Get attendance record by ID (ADMIN, FACULTY, STUDENT)
router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty", "student"),
  validateSchema(attendanceSchema.attendanceIdParamSchema, "params"),
  attendanceController.getAttendanceById,
);

// 7. Query attendance records with filters & pagination (ADMIN, FACULTY, STUDENT)
router.get(
  "/",
  authenticate,
  authorize("admin", "faculty", "student"),
  validateSchema(attendanceSchema.queryAttendanceSchema, "query"),
  attendanceController.findAttendances,
);

// 8. Update an attendance record (ADMIN, FACULTY)
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(attendanceSchema.attendanceIdParamSchema, "params"),
  validateSchema(attendanceSchema.updateAttendanceSchema, "body"),
  attendanceController.updateAttendance,
);

export default router;
