import { Request, Response } from "express";
import { User } from "../models/User";
import { Url } from "../models/Url";
import { timeStamp } from "console";
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const identityQuery = req.user.id
      ? { createdBy: req.user.id }
      : req.anonId
      ? { anonId: req.anonId }
      : null;

    if (!identityQuery) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const urls = await Url.find(identityQuery).sort({ timeStamp: -1 });

    return res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    console.error("Get activity error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
