import { Request, Response } from "express";

export const shortUrl = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
