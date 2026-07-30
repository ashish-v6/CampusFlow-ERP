import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type { RegisterUserDto } from "./dto/register-user.dto.js";
import createHttpError from "http-errors";
import { asyncHandler } from "../../utils/asyncHandler.js";

class AuthController {
  public SignUp = asyncHandler(async (req: Request, res: Response) => {
    const dto: RegisterUserDto = req.body;

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
    const { email } = req.body;
    if (!email) {
      throw createHttpError(400, "Email is required");
    }

    const result = await authService.sendVerificationEmail(email);

    res.status(200).json(result);
  });
}
const authController = new AuthController();
export default authController;
