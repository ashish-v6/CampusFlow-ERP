import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type * as dtos from "./auth.dto.js";
import createHttpError from "http-errors";
import { asyncHandler } from "../../utils/asyncHandler.js";

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
}
const authController = new AuthController();
export default authController;
