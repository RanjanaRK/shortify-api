import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { signedAnonToken, verifyAnonToken } from "../utils/anonToken";

const isProd = process.env.NODE_ENV === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    req.user = null;
    return next();
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
      req.user = { id: (decoded as any).id };
      return next();
    } catch {}
  }

  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as any;

      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id },
        process.env.JWT_SECRET!,
        { expiresIn: "5m" },
      );

      res.cookie("access_token", newAccessToken, cookieOptions);

      req.user = { id: decodedRefresh.id };
      return next();
    } catch {
      res.clearCookie("access_token", cookieOptions);
      res.clearCookie("refresh_token", cookieOptions);
      req.user = null;
      return next();
    }
  }

  req.user = null;
  next();
};

export const checkAnonUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.id) return next();

  let anonId: string | null = null;
  const token = req.cookies?.["anon-id"];

  if (token) {
    anonId = verifyAnonToken(token) as string;
  }

  if (!anonId) {
    anonId = nanoid();
    const signedToken = signedAnonToken(anonId);

    res.cookie("anon-id", signedToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
  }

  req.anonId = anonId;
  next();
};
