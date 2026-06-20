import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("No se proporcionó un token de autenticación válido.");
    err.status = 401;
    return next(err);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    const err = new Error("El formato del token de seguridad es incorrecto.");
    err.status = 401;
    return next(err);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const errorMsg = err.name === "TokenExpiredError" 
        ? "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión." 
        : "Token de autenticación inválido o alterado.";
        
      const authError = new Error(errorMsg);
      authError.status = 401;
      return next(authError);
    }

    req.user = payload; 
    next();
  });
};