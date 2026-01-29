import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";

import { requireAuth } from "../middlewares/authToken";
import { limiter } from "../middlewares/rateLimiter";
import { checkAnonUser } from "../middlewares/authanon";

const router = Router();

router.post("/register", checkAnonUser, register);

router.post("/login", checkAnonUser, limiter, login);

router.post("/refresh", refreshAccessToken);

router.post("/logout", requireAuth, logout);

export default router;
