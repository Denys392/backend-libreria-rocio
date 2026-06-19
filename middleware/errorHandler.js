export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message =
    status === 500
      ? "Ocurrió un error en el servidor"
      : err.message || "Error";

  console.error(`[${req.method} ${req.originalUrl}]`, err);

  return res.status(status).json({
    error: message,
    // ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};