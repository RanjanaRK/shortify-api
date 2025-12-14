import { Router } from "express";
import { CreateShortUrl, redirectShortUrl } from "../controllers/urlController";
import { auth, optionalAuth } from "../middlewares/auth";

const router = Router();

router.post("/urlShort", optionalAuth, CreateShortUrl);
router.get("/:code", redirectShortUrl);

export default router;
