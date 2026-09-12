import { Router } from "express";
import { authorize, authenticate } from "../../middlewares/auth.middlewares.js";
import { studentSchema } from "./student.schema.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { studentController } from "./student.controller.js";

const router = Router();

router.post(
  "/",
  validateSchema(studentSchema.studentCreateSchema, "body"),
  studentController.createStudent,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateSchema(studentSchema.studentUpdateSchema, "body"),
  studentController.updateStudent,
);

router.get("/:id", authenticate, authorize("admin"), studentController.getStudentById);

router.get(
  "/",
  validateSchema(studentSchema.studentQuerySchema, "query"),
  studentController.findStudents,
);
export default router;
