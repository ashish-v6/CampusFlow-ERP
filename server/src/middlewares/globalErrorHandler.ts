import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
      Stack: err.stack,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      name: err.name,
      message: err.message,
      cause: err.cause,
      Stack: err.stack,
    });
  }
  next();
};

export default globalErrorHandler;
