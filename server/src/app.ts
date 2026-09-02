import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import _config from "./config/config.js";
import type { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import testRoutes from "./modules/Test/test.routes.js";
import authRoutes from "./modules/Auth/auth.routes.js";
import userRoutes from "./modules/User/user.routes.js";
import studentRoutes from "./modules/Student/student.routes.js";

const app = express();

// --- Middleware order matters ---
app.use(helmet());
app.use(cors({ origin: _config.clientUrl, credentials: true }));
app.use(morgan(_config.environment === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// --- Routes go here ---
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);

// --- 404 + Global error handler (always LAST) ---
app.use(globalErrorHandler);

export default app;
