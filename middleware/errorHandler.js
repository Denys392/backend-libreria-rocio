export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  
  const message = status === 500 
    ? "Ocurrió un error inesperado en el servidor." 
    : err.message || "Error en la petición.";

  console.error(`[${req.method} ${req.originalUrl}]`, err);

  return res.status(status).json({
    message,
    errors: err.errors || [] 
    // ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};