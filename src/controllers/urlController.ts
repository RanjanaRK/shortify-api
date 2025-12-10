import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Url } from "../models/Url";

export const shortUrl = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "url is required" });
    }

    const shortUrl = nanoid(10);

    const newUrl = await Url.create({
      originalUrl,
      shortCode: shortUrl,
      //   createdBy: req.user.id,
    });

    return res.status(200).json({
      success: true,
      shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
      code: shortUrl,
      id: newUrl.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
