import express from "express";
import authcontrollers from "./auth.controller.js";

const router = express.Router();

router.post("/sign-up", authcontrollers.SignUp);
router.post("/send-otp", authcontrollers.SendVerificationEmail);
router.post("/verify-email", authcontrollers.verifyEmail);
router.post("/login", authcontrollers.LoginUser);
router.post("/rotate",authcontrollers.RotateToken);
router.post("/logout",authcontrollers.LogoutUser);
router.post("/logout-all",authcontrollers.LogoutAll);
router.post("/clear-cookie",authcontrollers.clearCookies);
router.post("/forgot-password",authcontrollers.ForgetPassword);
router.post("/reset-password",authcontrollers.ResetPassword);
router.post("/validate-token",authcontrollers.ValidateToken);

export default router;
