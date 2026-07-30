import express from "express";
import * as controllers from "./auth.controller.js";

const router = express.Router();

router.post("/sign-up", controllers.SignUp);

export default router;
