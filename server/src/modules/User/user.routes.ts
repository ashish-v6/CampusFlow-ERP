import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { userSchema } from "./user.schema.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  userControllers.getCurrentUser,
);

router.patch(
  "/me",
  authenticate,
  validateSchema(userSchema.updateUserProfileSchema, "body"),
  userControllers.updateUserProfile,
);
export default router;
