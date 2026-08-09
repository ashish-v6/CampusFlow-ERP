import type { Request, Response } from "express";
import { userServices } from "./user.service.js";
import * as dtos from "./user.dto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

class UserControllers {

  public getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const id: string | null = req.user?.userId as string;
    const user = await userServices.getCurrentUser(id);
    res.status(200).json({
      user,
    });
  });

  public updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const id: string | null = req.user?.userId as string;
    const dto: dtos.updateUserProfileDto = req.body;


    const user = await userServices.updateUserProfile(id, dto);
    res.status(200).json({
      user,
    });
  });

}

export const userControllers = new UserControllers();
