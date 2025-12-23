import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Url } from "../models/Url";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered",
      newUser: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(400).json({ message: "Email doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const anonId = req.anonId;

    if (anonId) {
      const abc = await Url.updateMany(
        {
          anonId,
          createdBy: null,
        },
        {
          $set: { createdBy: existingUser.id },
          $unset: { anonId: "" },
        }
      );
    }

    res.clearCookie("anonId", {
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("jwt-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: expiryDate,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: existingUser.id, email: existingUser.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt-token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
