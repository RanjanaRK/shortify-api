import jwt, { JwtPayload } from "jsonwebtoken";

export const signedAnonToken = (anonId: string) => {
  const signed = jwt.sign({ anonId }, process.env.ANON_SECRET!, {
    expiresIn: "1yr",
  });

  return signed;
};

export const verifyAnonToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.ANON_SECRET!) as JwtPayload;

    return decoded.anonId as string;
  } catch {
    return null;
  }
};
