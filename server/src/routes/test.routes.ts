import express from "express";
import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import createHttpError from "http-errors";
const router = express.Router();

router.get("/err", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name;
    if (!name) {
      return next(createHttpError(400, "Testing error"));
    }
    res.send("ok");
  } catch (e) {
    next(e);
  }
});

router.post("/add", async (req: Request, res: Response) => {
  const { email, name } = req.body;

  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  res.json(user);
});
router.post("/remove", async (req: Request, res: Response) => {
  const { id } = req.body;

  const user = await prisma.user.delete({
    where: { id: id },
  });

  res.json(user);
});

router.get("/show", async (req: Request, res: Response) => {
  const { id } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  res.json(user);
});

router.patch("/update", async (req: Request, res: Response) => {
  const { id, name, email } = req.body;

  const user = await prisma.user.update({
    data: {
      name,
      email,
    },
    where: {
      id,
    },
  });
  res.json(user);
});

export default router;
