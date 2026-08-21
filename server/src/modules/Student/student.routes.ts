import { Router } from "express";
import { userControllers } from "../User/user.controller.js";
import { authorize, authenticate } from "../../middlewares/auth.middlewares.js";
import { studentSchema } from "./student.schema.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";

const router = Router();
