import express from "express";
import authcontrollers from "./auth.controller.js";

const router = express.Router();

router.post("/sign-up", authcontrollers.SignUp);
router.post("/send-otp", authcontrollers.SendVerificationEmail);
router.post("/verify-email", authcontrollers.verifyEmail);
router.post("/login", authcontrollers.LoginUser);
router.post("/rotate",authcontrollers.RotateToken);

export default router;
