import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as JwtPayload;
    req.user = { id: decoded.id };
    return next();
  } catch {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as JwtPayload;

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET!,
        { expiresIn: "5m" },
      );

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      req.user = { id: decoded.id };
      return next();
    } catch {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.status(401).json({ message: "Session expired" });
    }
  }
};
