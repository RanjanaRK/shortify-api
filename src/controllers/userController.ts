import { Request, Response } from "express";
import { Url } from "../models/Url";
import { User } from "../models/User";
import { UrlClick } from "../models/UrlClick";

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

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // find user

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // find urls
    const userUrls = await Url.find({ createdBy: userId });

    const urlIds = userUrls.map((u) => u._id);

    // Delete analytics
    await UrlClick.deleteMany({ urlId: { $in: urlIds } });

    //  Delete URLs
    await Url.deleteMany({ createdBy: userId });

    //  Delete user
    await User.findByIdAndDelete(userId);

    //  Clear cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const identityQuery = req.user?.id
      ? { createdBy: req.user.id }
      : req.anonId
      ? { anonId: req.anonId }
      : null;

    if (!identityQuery)
      return res.status(401).json({ message: "Unauthorized" });

    console.log(req.user.id, "userId");

    const urls = await Url.find(identityQuery).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
