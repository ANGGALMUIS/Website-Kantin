import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi nanti",
  },

  standardHeaders: true,

  legacyHeaders: false,
});
