import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true, // 🔥 MUST
  sameSite: "none",
  path: "/",
};

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

      res.cookie("access_token", newAccessToken, cookieOptions);

      req.user = { id: decoded.id };
      return next();
    } catch {
      res.clearCookie("access_token", cookieOptions);
      res.clearCookie("refresh_token", cookieOptions);
      return res.status(401).json({ message: "Session expired" });
    }
  }
};

// requireAuth.ts
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// export const requireAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.cookies.access_token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//     req.user = { id: decoded.id };
//     next();
//   } catch {
//     return res.status(401).json({ message: "Token expired" });
//   }
// };
