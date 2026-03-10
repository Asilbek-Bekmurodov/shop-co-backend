import rateLimit from "express-rate-limit";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) || 100;

const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Juda ko'p urinish bo'ldi. Keyinroq urinib ko'ring.",
  },
});

export default apiLimiter;
