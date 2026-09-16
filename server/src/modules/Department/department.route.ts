import { Router } from "express";
import { departmentController } from "./department.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { departmentSchema } from "./department.schema.js";

const router = Router();

router.get("/", departmentController.getDepartments);

export default router;
