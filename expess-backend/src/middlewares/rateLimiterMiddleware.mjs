import rateLimit from 'express-rate-limit';

// Creating a limiter
export const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many request from this IP',
});
