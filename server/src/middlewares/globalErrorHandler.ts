import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "http-errors";

const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.statusCode || 500).json({
    message: err.message,
    Stack: process.env.NODE_ENV === "devlopment" ? err.stack : "",
  });
  next();
};

export default globalErrorHandler;
