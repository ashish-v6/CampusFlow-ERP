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

  public updateUserPassword = asyncHandler(async(req : Request, res : Response) => {
    const id : string | null = req.user?.userId as string;
    const dto : dtos.updateUserPasswordDto = req.body;
    await userServices.updateUserPassword(id, dto);
    res.status(200).json({
      success : true,
      message : "Password change successful",
    });
  })

  public getAllUsers = asyncHandler(async(req : Request, res : Response) => {
    const dto = req.validated?.query as dtos.getAllUsersDto;
    
    const result = await userServices.getAllUsers(dto);

    res.status(200).json({
      result,
    })
  })

}

export const userControllers = new UserControllers();
