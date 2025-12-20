import jwt from "jsonwebtoken";

const ANON_SECRET = process.env.ANON_SECRET!;

export const signedAnonToken = (anonId: string) => {
  const signed = jwt.sign({ anonId }, ANON_SECRET, {
    expiresIn: "1yr",
  });
  return signed;
};
