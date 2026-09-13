import type { Request, Response } from "express";
import { Router } from "express";
import prisma from "../../utils/prisma.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

class ProgramController {
  public getPrograms = asyncHandler(async (_req: Request, res: Response) => {
    const programs = await prisma.program.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(programs);
  });
}

const programController = new ProgramController();
const router = Router();

router.get("/", programController.getPrograms);

export default router;