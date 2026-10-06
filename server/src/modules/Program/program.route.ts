import { Router } from "express";
import { programController } from "./program.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { programSchema } from "./program.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateSchema(programSchema.createProgramSchema, "body"),
  programController.createProgram,
);

router.get(
  "/stats",
  authenticate,
  authorize("admin", "faculty"),
  programController.getProgramStats,
);

router.get(
  "/",
  authenticate,
  authorize("admin", "faculty", "student"),
  validateSchema(programSchema.programQuerySchema, "query"),
  programController.getPrograms,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "faculty", "student"),
  validateSchema(programSchema.programIdParamSchema, "params"),
  programController.getProgramById,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateSchema(programSchema.programIdParamSchema, "params"),
  validateSchema(programSchema.updateProgramSchema, "body"),
  programController.updateProgram,
);

export default router;