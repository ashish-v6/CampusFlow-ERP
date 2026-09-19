import { Router } from "express";
import { attendanceController } from "./attendance.controller.js";
import { authorize, authenticate } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { attendanceSchema } from "./attendance.schema.js";

const router = Router();

void attendanceController;

export default router;
