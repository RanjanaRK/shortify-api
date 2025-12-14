import { Router } from "express";
import { CreateShortUrl, redirectShortUrl } from "../controllers/urlController";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/urlShort", CreateShortUrl);
router.get("/:code", redirectShortUrl);

export default router;
