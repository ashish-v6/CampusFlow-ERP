import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import type { RegisterUserDto } from "./dto/register-user.dto.js";
import createHttpError from "http-errors";

const SignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: RegisterUserDto = req.body;

    if (!dto) {
      return next(createHttpError(400, "All fields are required"));
    }

    const result = await authService.register(dto);

    res.send(result);
    next();
  } catch (e) {
    console.log(e);
  }
};

export { SignUp };
