import { Router } from "express";

import { CreateShortUrl, redirectShortUrl } from "../controllers/urlController";
import { checkAnonUser, optionalAuth } from "../middlewares/authanon";

const router = Router();

router.post("/urlShort", optionalAuth, checkAnonUser, CreateShortUrl);

router.get("/:code", redirectShortUrl);

export default router;
