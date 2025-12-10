import { Router } from "express";
import { shortUrl } from "../controllers/urlController";

const router = Router();

router.post("/urlShort", shortUrl);

export default router;
