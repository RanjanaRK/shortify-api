import express from "express";
import { generateQrCode } from "../controllers/qrController";
import { requireAuth } from "../middlewares/authToken";

const router = express.Router();

router.post("/generate", requireAuth, generateQrCode);

export default router;
