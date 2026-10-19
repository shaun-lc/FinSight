import rateLimit from 'express-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;

function createLimiter(max, message) {
  return rateLimit({
    windowMs: WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });
}

export const authLimiter = createLimiter(10, 'Too many attempts, please try again in 15 minutes');
export const apiLimiter = createLimiter(100, 'Too many requests, please try again later');
