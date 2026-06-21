import { Router } from "express";
import {
  login,
  register,
  registerByStaff,
  refresh,
  logout,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { registerSchema, loginSchema } from "../utils/schemas/authSchema.js";

import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema, "body"), register);
router.post("/login", authLimiter, validate(loginSchema, "body"), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post(
  "/register/user",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(registerSchema, "body"),
  registerByStaff,
);

export default router;
