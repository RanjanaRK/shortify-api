import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// export const auth = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   try {
//     if (req.headers.authorization === null) {
//       req.user = null;
//       return next();
//     }

//     if (!token)
//       return res.status(401).json({ message: "Unauthorized: No token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: string;
//     };
//     (req as any).user = decoded;

//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//     req.user;
//   }
// };

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.cookies.access_token;
    console.log("CookiesToken:", token);

    console.log("Incoming cookies:", req.cookies.access_token);
    console.log("Incoming AccesssToekn:", req.cookies?.["access_token"]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = { id: decoded.id as string };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// export const optionalAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const accessToken = req.cookies.access_token;
//   const refreshToken = req.cookies.refresh_token;

//   console.log(accessToken, ":optionalauthatoekn");
//   console.log(refreshToken, ":optionrefreshtoken");
//   if (!refreshToken || !accessToken) {
//     req.user = null;
//     return next();
//   }

//   try {
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
//     req.user = decoded;
//     return next();
//   } catch {
//     if (!refreshToken) {
//       req.user = null;

//       return next();
//     }
//   }

//   next();
// };

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  // No refresh → definitely anonymous
  if (!refreshToken) {
    req.user = null;
    return next();
  }

  // Try access token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
      req.user = decoded;
      return next();
    } catch {
      // fall through to refresh
    }
  }

  // 🔁 REFRESH ACCESS TOKEN
  try {
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as any;

    const newAccessToken = jwt.sign(
      { id: decodedRefresh.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    req.user = { id: decodedRefresh.id };
    return next();
  } catch {
    req.user = null;
    return next();
  }
};
