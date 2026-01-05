import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { signedAnonToken, verifyAnonToken } from "../utils/anonToken";

// optionalAuth handles access/refresh token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    } catch {
      // fallthrough to refresh token
    }
  }

  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as any;

      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id },
        process.env.JWT_SECRET!,
        { expiresIn: "5m" }
      );

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      req.user = { id: decodedRefresh.id };
      return next();
    } catch {
      req.user = null;
      return next();
    }
  }

  req.user = null;
  next();
};

// checkAnonUser: creates anonId cookie for non-logged-in users
export const checkAnonUser = (
  req: Request,
  res: Response,
  next: NextFunction
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
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  req.anonId = anonId;
  next();
};
