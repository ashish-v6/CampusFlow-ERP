import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middlewares.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { profileController } from "./profile.controller.js";
import { profileSchema } from "./profile.schema.js";

const router = Router();

/**
 * GET /api/profile
 * Returns authenticated user's own profile with role-specific details (Student or Faculty)
 */
router.get(
  "/",
  authenticate,
  profileController.getProfile,
);

/**
 * PATCH /api/profile
 * Updates permitted personal profile fields (firstName, lastName, phone, address).
 * Strictly rejects any forbidden/privileged fields (role, status, email, identifiers).
 */
router.patch(
  "/",
  authenticate,
  validateSchema(profileSchema.updateProfileSchema, "body"),
  profileController.updateProfile,
);

/**
 * PATCH /api/profile/change-password
 * Verifies current password and updates password with secure hash
 */
router.patch(
  "/change-password",
  authenticate,
  validateSchema(profileSchema.changePasswordSchema, "body"),
  profileController.changePassword,
);

export default router;
