import express from "express";
import * as controllers from "./auth.controller.js"

const router = express.Router();

router.get("/sign-up",controllers.SignUp);

export default router;