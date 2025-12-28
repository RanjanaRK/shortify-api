import express from "express";
import { generateQrCode } from "../controllers/qrController";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/generate", requireAuth, generateQrCode);

export default router;
