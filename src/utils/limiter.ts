import rateLimit from "express-rate-limit";

export const ratelimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

export const ratelimitlogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});
