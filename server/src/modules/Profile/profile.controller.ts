import type { Request, Response } from "express";
import type { User } from "../../middlewares/auth.middlewares.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { ChangePasswordDto, UpdateProfileDto } from "./profile.dto.js";
import { profileService } from "./profile.service.js";

export class ProfileController {
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const currentUser = req.user as User;
    const user = await profileService.getOwnProfile(currentUser.userId);
    res.status(200).json({ user });
  });

  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const currentUser = req.user as User;
    const dto = req.body as UpdateProfileDto;
    const user = await profileService.updateOwnProfile(currentUser.userId, dto);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    const currentUser = req.user as User;
    const dto = req.body as ChangePasswordDto;
    const result = await profileService.changePassword(currentUser.userId, dto);
    res.status(200).json(result);
  });
}

export const profileController = new ProfileController();
