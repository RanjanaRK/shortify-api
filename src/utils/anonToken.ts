import jwt from "jsonwebtoken";

const ANON_SECRET = process.env.ANON_SECRET!;

export interface AnonPayload {
  anonId: string;
}
export const signedAnonToken = (anonId: string) => {
  const signed = jwt.sign({ anonId }, ANON_SECRET, {
    expiresIn: "1yr",
  });

  console.log(signed, "signed msg");

  return signed;
};

export const verifyAnonToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, ANON_SECRET) as AnonPayload;
    return decoded.anonId;
  } catch {
    return null;
  }
};
