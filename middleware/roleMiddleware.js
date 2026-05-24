import { ROLES } from "../utils/roles.js";

export const permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};

export const isAdminOrDev = permitRoles(ROLES.ADMIN, ROLES.DEV);
