import { Router } from "express";
import { CreateShortUrl, redirectShortUrl } from "../controllers/urlController";
import { auth, optionalAuth } from "../middlewares/auth";
import { checkAnonUser } from "../middlewares/checkAnonId";

const router = Router();

router.post("/urlShort", optionalAuth, checkAnonUser, CreateShortUrl);
router.get("/:code", redirectShortUrl);

export default router;
