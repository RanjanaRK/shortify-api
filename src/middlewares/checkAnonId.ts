import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import { signedAnonToken, verifyAnonToken } from "../utils/anonToken";

export const checkAnonUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let anonId: string | null = null;
    const token = req.cookies?.["anon-id"];

    if (token) {
      anonId = verifyAnonToken(token) as string;
    }

    if (!anonId) {
      anonId = nanoid();
      const signedToken = signedAnonToken(anonId);

      res.cookie("anon-id", signedToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
    }

    req.anonId = anonId;

    next();
  } catch (err) {
    console.error("Anon middleware error:", err);
    next();
  }
};
