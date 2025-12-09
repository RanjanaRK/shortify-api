import express, { Request, Response } from "express";
import { auth } from "../middlewares/auth";
import { getAllUsers } from "../controllers/userController";

const router = express.Router();

router.get("/me", auth, async (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});

router.get("/users", auth, getAllUsers);

export default router;
