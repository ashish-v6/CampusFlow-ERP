import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import { errorHandler } from "./middlewares/errorHandler.js";
// import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const app = express();

// --- Middleware order matters ---
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// --- Routes go here ---
// app.use("/api/v1/users", userRoutes);

// --- 404 + Global error handler (always LAST) ---
// app.use(notFoundHandler);
// app.use(errorHandler);

export default app;