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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = { id: decoded.id as string };
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["jwt-token"];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
  } catch {
    req.user = null;
  }

  next();
};
