import { Router } from "express";
import { CreateShortUrl, redirectShortUrl } from "../controllers/urlController";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/urlShort", auth, CreateShortUrl);
router.get("/:code", auth, redirectShortUrl);

export default router;
