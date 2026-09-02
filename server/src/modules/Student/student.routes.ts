import { Router } from "express";
import { authorize, authenticate } from "../../middlewares/auth.middlewares.js";
import { studentSchema } from "./student.schema.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { studentController } from "./student.controller.js";

const router = Router();


router.post(
    "/",
    authenticate,
    authorize("admin"),
    validateSchema(studentSchema.studentCreateSchema,"body"),
    studentController.createStudent,
)

export default router