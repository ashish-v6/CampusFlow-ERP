import { Router } from "express";
import { departmentController } from "./department.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { departmentSchema } from "./department.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateSchema(departmentSchema.createDepartmentSchema, "body"),
  departmentController.createDepartment,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  departmentController.getDepartmentById,
);

router.get(
  "/",
    authenticate,
    authorize("admin"),
  validateSchema(departmentSchema.departmentQuerySchema, "query"),
  departmentController.getDepartments,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateSchema(departmentSchema.updateDepartmentSchema, "body"),
  departmentController.updateDepartment,
);

export default router;
