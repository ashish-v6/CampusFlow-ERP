import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import type { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import testRoutes from "./routes/test.routes.js";

const app = express();

// --- Middleware order matters ---
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// --- Routes go here ---
app.use("/test", testRoutes);

// --- 404 + Global error handler (always LAST) ---

app.use(globalErrorHandler);
export default app;
