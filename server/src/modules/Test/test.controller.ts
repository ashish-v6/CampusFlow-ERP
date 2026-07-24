import type { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma.js";
import createHttpError from "http-errors";

const errorHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name} = req.body;
    if (!name) {
      return next(createHttpError(400, "Testing error"));
    }
    res.send("ok");
  } catch (e) {
    next(e);
  }
};

const addHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return next(createHttpError(400, "All fields are required"));
    }
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    res.json(user);
  } catch (e) {
    next(e);
  }
};
const removeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(createHttpError(400, "Id is required"));
    }
    const user = await prisma.user.delete({
      where: { id: id },
    });

    res.json(user);
  } catch (e) {
    next(e);
  }
};

const showHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(createHttpError(400, "Id is required"));
    }
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    res.json(user);
  } catch (e) {
    next(e);
  }
};

const updateHandler =  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
      return next(createHttpError(400, "All Fields are required"));
    }

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
  } catch (e) {
    next(e);
  }
};

export {
  errorHandler,
  addHandler,
  removeHandler,
  showHandler,
  updateHandler
};