import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { User } from "../models/User";

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

    return res.status(200).json({
      message: "Login successful",
      user: { id: existingUser.id, email: existingUser.email },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
