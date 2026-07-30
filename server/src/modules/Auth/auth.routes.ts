import express from "express";
import authcontrollers from "./auth.controller.js";

const router = express.Router();

router.post("/sign-up", authcontrollers.SignUp);
router.post("/send-otp", authcontrollers.SendVerificationEmail);

export default router;
