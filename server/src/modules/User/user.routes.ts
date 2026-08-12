import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";
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

router.patch(
  "/change-password",
  authenticate,
  validateSchema(userSchema.updatePasswordSchema, "body"),
  userControllers.updateUserPassword,
)

router.get(
  "/users",
  authenticate,
  authorize("admin"),
  validateSchema(userSchema.getAllUsersQuerySchema,"query"),
  userControllers.getAllUsers,
)

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validateSchema(userSchema.veifyIdParamsSchema,"params"),
  userControllers.getUserById,
)

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validateSchema(userSchema.veifyIdParamsSchema,"params"),
  validateSchema(userSchema.upateUserStatusSchema,"body"),
  userControllers.updateUserStatus,
)

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateSchema(userSchema.veifyIdParamsSchema,"params"),
  userControllers.inactivateUser,
)
export default router;
