import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import type { ZodObject } from "zod";

type Target = "body" | "query" | "params";

declare module "express" {
  export interface Request {
    validated?: {
      query?: unknown;
    };
  }
}

export function validateSchema(schema: ZodObject, target: Target) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[target];

      const result = schema.safeParse(data);

      const message = result.error?.issues[0]?.message ?? "Validation Failed";

      if (!result.success) {
        return next(createHttpError(400, message));
      }
      if (target === "body" || target === "params") {
        req[target] = result.data;
      }
      if (target === "query") {
        req.validated = {
          query: result.data,
        };
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
