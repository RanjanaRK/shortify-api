import { Router } from "express";
import { login, logout, register } from "../controllers/authController";
import { limiter } from "../middlewares/rateLimiter";
import { checkAnonUser } from "../middlewares/checkAnonId";

const router = Router();

router.post("/register", checkAnonUser, register);

router.post("/login", checkAnonUser, limiter, login);

router.post("/logout", logout);

export default router;
