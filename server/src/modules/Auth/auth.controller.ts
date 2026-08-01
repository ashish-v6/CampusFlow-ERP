import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type * as dtos from "./auth.dto.js";
import createHttpError from "http-errors";
import { asyncHandler } from "../../utils/asyncHandler.js";
import authUtils from "./auth.utils.js";

class AuthController {
  public SignUp = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.RegisterUserDto = req.body;

    if (!dto.firstName || !dto.lastName || !dto.email || !dto.password) {
      throw createHttpError(400, "All fields are required");
    }

    const result = await authService.register(dto);

    res.status(201).json({
      success: true,
      message: "User Created successfully",
      user: {
        id: result.id,
        Role: result.role,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        isVerified: result.isVerified,
      },
    });
  });

  public SendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.SendVerificationEmailDto = req.body;
    if (!dto.email) {
      throw createHttpError(400, "Email is required");
    }

    await authService.sendVerificationEmail(dto);

    res.status(200).json({ success: true, message: "OTP is sent to registered email" });
  });

  public verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.VerifyEmailDto = req.body;

    if (!dto.email || !dto.otp) {
      throw createHttpError(400, "All fields are required");
    }

    await authService.verifyEmail(dto);

    res.status(200).json({
      success: true,
      message: "User Verified",
    });
  });

  public LoginUser = asyncHandler(async (req: Request, res: Response) => {
    const dto: dtos.LoginDto = req.body;
    const context: dtos.LoginContextDto = {
      ip: req.ip as string,
      userAgent: req.headers["user-agent"] as string,
    };

    if (req.cookies && req.cookies?.refreshToken) {
      throw createHttpError(403, "Session is running");
    }

    if (!dto.email || !dto.password) {
      throw createHttpError(400, "All Fields are required");
    }

    const result = await authService.login(dto, context);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      authUtils.cookie_config as import("express").CookieOptions,
    );

    res.status(200).json({
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
      },
    });
  });

  public RotateToken = asyncHandler(async (req : Request, res : Response) => {
    if (req.cookies && !req.cookies.refreshToken) {
      throw createHttpError(400, "Token missing");
    }
    const dto : dtos.RotateTokenDto = {refreshToken : req.cookies.refreshToken as string};
    const context: dtos.LoginContextDto = {
      ip: req.ip as string,
      userAgent: req.headers["user-agent"] as string,
    };

    const result = await authService.rotateToken(dto,context);

    res.cookie("refreshToken",result.refreshToken, authUtils.cookie_config as import("express").CookieOptions )
    res.status(200).json({
      accessToken : result.accessToken
    })
  })
}
const authController = new AuthController();
export default authController;
