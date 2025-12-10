import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: "Too many requests",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
