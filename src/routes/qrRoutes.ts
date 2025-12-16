import express from "express";
import { generateQrCode } from "../controllers/qrController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post("/generate", auth, generateQrCode);

export default router;
