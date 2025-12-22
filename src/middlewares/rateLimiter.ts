import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: (req, res) => {
    return res.status(429).json({
      code: "LOGIN_RATE_LIMIT",
      message: "Too many login attempts.",
    });
  },
});
