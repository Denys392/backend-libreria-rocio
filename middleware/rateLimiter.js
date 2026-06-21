import { rateLimit } from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60,
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req, res, next) => {
    const err = new Error("Demasiadas solicitudes desde esta IP. Por favor, inténtalo de nuevo en un minuto.");
    err.status = 429; 
    next(err);
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const err = new Error("Demasiados intentos de inicio de sesión. Por favor, intenta en 15 minutos.");
    err.status = 429;
    next(err);
  }
});