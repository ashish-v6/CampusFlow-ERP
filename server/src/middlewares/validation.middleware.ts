import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import type { ZodObject } from "zod";

type Target = "body" | "query" | "params"

export function validateSchema (schema : ZodObject, target : Target){
    return (req : Request, res : Response, next : NextFunction) => {
        try{
            const data = req[target];
    
            const result = schema.safeParse(data);

            const message = result.error?.issues[0]?.message ?? "Validation Failed";

            if(!result.success){
                return next(createHttpError(400, message));
            }

            req[target] = result.data;
            next();
        }
        catch(error){
            next(error);
        }
    }
}