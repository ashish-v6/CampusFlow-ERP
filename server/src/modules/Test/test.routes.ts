import express from "express";
import { addHandler, errorHandler, removeHandler, showHandler, updateHandler } from "./test.controller.js";
const router = express.Router();

router.get("/err",errorHandler);
router.post("/add",addHandler);
router.post("/remove",removeHandler);
router.get("/show",showHandler);
router.patch("/update",updateHandler);

export default router;
