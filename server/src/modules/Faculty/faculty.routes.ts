import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { facultyController } from "./faculty.controller.js";
import { facultySchema } from "./faculty.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateSchema(facultySchema.createFacultySchema, "body"),
  facultyController.createFaculty,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty"),
  validateSchema(facultySchema.getFacultyByIdSchema, "params"),
  facultyController.getFacultyById,
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  validateSchema(facultySchema.getFacultiesSchema, "query"),
  facultyController.getFaculties,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateSchema(facultySchema.FacultyUpdateShcema, "body"),
  facultyController.updateFaculty,
);

export default router;
