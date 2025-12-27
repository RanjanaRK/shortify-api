import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
import { Url } from "../models/Url";

// <----------------------------------REGISTRATION----------------------------------->

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const anonId = req.anonId;

    if (anonId) {
      await Url.updateMany(
        {
          anonId,
          createdBy: null,
        },
        {
          $set: { createdBy: newUser.id },
          $unset: { anonId: "" },
        }
      );
    }

    return res.status(201).json({
      message: "User registered",
      newUser: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// <----------------------------------lOGIN----------------------------------->

export const login = async (req: Request, res: Response) => {
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
  const refreshExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Normalize email to avoid case/space issues
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare plaintext password with hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    //create a access token
    const accessToken = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "10m",
      }
    );

    // create refresh token

    const refreshToken = jwt.sign(
      { id: existingUser.id },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "2d",
      }
    );

    //  Migrate anonymous URLs to logged-in user
    const anonId = req.anonId;

    if (anonId) {
      const abc = await Url.updateMany(
        {
          anonId: req.anonId,
        },
        {
          $set: { createdBy: existingUser.id },
          $unset: { anonId: "" },
        }
      );
    }

    //  Clear anonymous  cookie after login
    res.clearCookie("anon-id", {
      httpOnly: true,
      sameSite: "lax",
    });

    // Store refresh token in cookie
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: refreshExpiry,
      path: "/",
    });

    // Send success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    // extract refresh token from cookie
    const refreshToken = req.cookies["refresh-token"];

    // If refresh token does not exist, user is not authenticated
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token is missing" });
    }

    // Verify refresh token using refresh token secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    console.log(decoded);

    //  Create a new short-lived access token
    const newAccessToken = jwt.sign({ id: decoded }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });

    // Send new access token to client
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// export const login = async (req: Request, res: Response) => {
//   const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

//   try {
//     const { email, password } = req.body;
//     const normalizedEmail = email.trim().toLowerCase();

//     const existingUser = await User.findOne({ email: normalizedEmail });

//     if (!existingUser) {
//       return res.status(400).json({ message: "Email doesn't exists" });
//     }

//     const isMatch = await bcrypt.compare(password, existingUser.password);

//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET!, {
//       expiresIn: "1h",
//     });

//     const anonId = req.anonId;

//     if (anonId) {
//       const abc = await Url.updateMany(
//         {
//           anonId: req.anonId,
//         },
//         {
//           $set: { createdBy: existingUser.id },
//           $unset: { anonId: "" },
//         }
//       );
//     }

//     res.clearCookie("anon-id", {
//       httpOnly: true,
//       sameSite: "lax",
//     });

//     res.cookie("jwt-token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "lax",
//       expires: expiryDate,
//       path: "/",
//     });

//     return res.status(200).json({
//       message: "Login successful",
//       user: { id: existingUser.id, email: existingUser.email },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// <----------------------------------LOGOUT----------------------------------->

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt-token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
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
