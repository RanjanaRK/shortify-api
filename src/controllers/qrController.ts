import { Request, Response } from "express";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { Url } from "../models/Url";

export const generateQrCode = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const existing = await Url.findOne({ originalUrl });

    if (!existing) {
      const shortCode = nanoid(10);

      const newUrl = await Url.create({
        originalUrl,
        shortCode,
        createdBy: req.user?.id || null,
      });

      const shortUrl = `${process.env.BASE_URL}/${newUrl.shortCode}`;

      const qrImage = await QRCode.toBuffer(shortUrl);

      return res.status(200).json({
        success: true,
        message: "QR Code generated, generated shorURl right now",
        qr: qrImage,
        shortUrl,
        originalUrl,
      });
    }

    const finalShortUrl = `${process.env.BASE_URL}/${existing.shortCode}`;
    const qrImage = await QRCode.toDataURL(finalShortUrl);

    return res.status(200).json({
      success: true,
      message: "QR Code generated , short url already generated",
      qr: qrImage,
      shortUrl: finalShortUrl,
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
