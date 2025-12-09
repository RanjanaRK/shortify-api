import express, { Request, Response } from "express";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/me", auth, async (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});
export default router;
