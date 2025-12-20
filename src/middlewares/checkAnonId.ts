import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import { signedAnonToken, verifyAnonToken } from "../utils/anonToken";

// export const checkAnonUser = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.cookies["anon-id"];
//   let anonId: string;

//   if (token) {
//     const verified = verifyAnonToken(token);
//     anonId = verified ?? nanoid();
//   } else {
//     anonId = nanoid();
//   }

//   res.cookie("anon-id", signedAnonToken(anonId), {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 1000 * 60 * 60 * 24 * 365,
//   });

//   req.anonId = anonId;
//   next();
// };

export const checkAnonUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["anon-id"];
  console.log(token, "checkanonuser");

  try {
    if (token) {
      const anonId = verifyAnonToken(token);

      if (anonId) {
        req.anonId = anonId;
        return next();
      }
    }

    if (!token) {
      const anonId = nanoid();
      const signedToken = signedAnonToken(anonId);
      res.cookie("anon-id", signedToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
    }
  } catch {}

  next();
};
