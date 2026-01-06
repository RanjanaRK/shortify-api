import { Router } from "express";

import { CreateShortUrl, redirectShortUrl } from "../controllers/urlController";
import { checkAnonUser, optionalAuth } from "../middlewares/authanon";
import { getUrlAnalytics } from "../controllers/urlClicksController";
import { requireAuth } from "../middlewares/authToken";

const router = Router();

router.post("/urlShort", optionalAuth, checkAnonUser, CreateShortUrl);

router.get("/:code", redirectShortUrl);

router.get("/urls/analytics/:id", requireAuth, getUrlAnalytics);

export default router;
