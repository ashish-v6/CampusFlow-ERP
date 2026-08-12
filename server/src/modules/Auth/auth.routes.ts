import express from "express";
import authcontrollers from "./auth.controller.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { authSchema } from "./auth.schema.js";

const router = express.Router();

router.post("/sign-up", validateSchema(authSchema.signUp, "body"), authcontrollers.SignUp);

router.post(
  "/send-otp",
  validateSchema(authSchema.sendEmail, "body"),
  authcontrollers.SendVerificationEmail,
);

router.post(
  "/verify-email",
  validateSchema(authSchema.verifyEmail, "body"),
  authcontrollers.verifyEmail,
);

router.post("/login", validateSchema(authSchema.Login, "body"), authcontrollers.LoginUser);

router.post("/rotate", authcontrollers.RotateToken);

router.post("/logout", authcontrollers.LogoutUser);

router.post("/logout-all", authcontrollers.LogoutAll);

router.post("/clear-cookie", authcontrollers.clearCookies);

router.post(
  "/forgot-password",
  validateSchema(authSchema.ForgetPassword, "body"),
  authcontrollers.ForgetPassword,
);

router.post(
  "/reset-password",
  validateSchema(authSchema.resetPassword, "body"),
  authcontrollers.ResetPassword,
);

router.post(
  "/validate-token",
  validateSchema(authSchema.validateToken, "body"),
  authcontrollers.ValidateToken,
);

export default router;
