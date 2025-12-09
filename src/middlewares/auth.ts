import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token)
      return res.status(401).json({ message: "Unauthorized: No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    (req as any).user = decoded;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    (req as any).user = user;

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
