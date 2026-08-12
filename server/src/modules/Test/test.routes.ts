import Router from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middlewares.js";

const router = Router();

declare module "express" {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

router.get("/public", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true });
  next();
});
router.get("/auth", authenticate, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ user: req.user });
  next();
});
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ user: req.user });
    next();
  },
);
router.get(
  "/admin-student",
  authenticate,
  authorize("student", "admin"),
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ user: req.user });
    next();
  },
);

export default router;
