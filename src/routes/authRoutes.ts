import { Router } from "express";
import { login, logout, register } from "../controllers/authController";
import { limiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/register", register);

router.post("/login", limiter, login);

router.post("/logout", logout);

export default router;
