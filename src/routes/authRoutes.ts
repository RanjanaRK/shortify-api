import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";
import { limiter } from "../middlewares/rateLimiter";
import { checkAnonUser } from "../middlewares/checkAnonId";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/register", checkAnonUser, register);

router.post("/login", checkAnonUser, limiter, login);

router.post("/refresh", refreshAccessToken);

router.post("/logout", requireAuth, logout);

export default router;
