import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { programService } from "./program.service.js";
import type * as dtos from "./program.dto.js";

export class ProgramController {
  public createProgram = asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as dtos.CreateProgramDto;
    const program = await programService.createProgram(dto);
    res.status(201).json({
      success: true,
      message: "Program created successfully",
      program,
    });
  });

  public getPrograms = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.validated?.query || req.query) as unknown as dtos.ProgramQueryDto;
    const result = await programService.getPrograms(query);
    res.status(200).json(result);
  });

  public getProgramById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const program = await programService.getProgramById(id);
    res.status(200).json({ program });
  });

  public updateProgram = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const dto = req.body as dtos.UpdateProgramDto;
    const program = await programService.updateProgram(id, dto);
    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      program,
    });
  });

  public getProgramStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await programService.getProgramStats();
    res.status(200).json({ result: stats });
  });
}

export const programController = new ProgramController();
