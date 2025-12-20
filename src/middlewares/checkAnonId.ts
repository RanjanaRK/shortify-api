import { log } from "console";
import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";

export const checkAnonUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let anonId = req.cookies["anon-id"];
  const ip = req.ip;

  console.log(ip, "ip");
  try {
    if (!anonId) {
      anonId = nanoid();

      res.cookie("anon-id", anonId, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      });
    }
  } catch {}

  next();
};
