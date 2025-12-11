import { Request, Response } from "express";
import QRCode from "qrcode";

export const generateQrCode = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Generate QR Code as Base64
    const qrImage = await QRCode.toDataURL(originalUrl);

    return res.status(200).json({
      success: true,
      message: "QR Code generated",
      qr: qrImage, // Base64 image string
      originalUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate QR code",
      error: error.message,
    });
  }
};
