import express from "express";
import { generateQrCode } from "../controllers/qrController";

const router = express.Router();

router.post("/generate", generateQrCode);

export default router;
