import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import authUtils from "../modules/Auth/auth.utils.js";

interface User {
  userId: string;
  email: string;
  role: string;
}

type Role = "admin" | "faculty" | "student";

declare module "express" {
  export interface Request {
    user?: User;
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validHeader = req.headers.authorization?.startsWith("Bearer ey");

    if (!validHeader) {
      return next(createHttpError(401, "Invalid Token"));
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(createHttpError(401, "Token not found"));
    }

    const decoded = authUtils.verifyAccessToken(token);

    if (!decoded) {
      return next(createHttpError(401, "Invalid Token"));
    }

    req.user = decoded as User;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createHttpError(401, "No credential found"));
    }

    const role = req.user.role.toLowerCase() as Role;

    if (!roles.includes(role)) {
      return next(createHttpError(403, "Forbidden"));
    }
    next();
  };
};
