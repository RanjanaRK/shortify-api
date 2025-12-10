import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Url } from "../models/Url";

export const CreateShortUrl = async (req: Request, res: Response) => {
  const base = process.env.BASE_URL!.replace(/\/$/, "");
  try {
    const { originalUrl, shortCode } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ message: "url is required" });
    }

    const existing = await Url.findOne({ originalUrl });

    if (originalUrl.startsWith(base + "/")) {
      return res.status(400).json({
        success: false,
        message: "URL is banned",
      });
    }

    if (existing) {
      return res.status(201).json({
        success: true,
        message: "URL already shortened",
        shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
        code: existing.shortCode,
        id: existing._id,
      });
    }

    const existingShort = await Url.findOne({ shortCode });

    if (existingShort) {
      return res.status(201).json({
        success: true,
        message: "URL already shortened",
        // shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
        // code: existing.shortCode,
        // id: existing._id,
      });
    }

    const shortUrl = nanoid(10);

    const newUrl = await Url.create({
      originalUrl,
      shortCode: shortUrl,
      //   createdBy: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "short url created",
      shortUrl: `${process.env.BASE_URL}/api/${shortUrl}`,
      code: shortUrl,
      id: newUrl.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const redirectShortUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    return res.redirect(url.originalUrl);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
