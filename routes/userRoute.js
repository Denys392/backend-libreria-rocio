import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";

import {
  getMyProfile,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  userQuerySchema,
  userIdSchema,
  updateUserSchema,
} from "../utils/schemas/userSchema.js";

const router = Router();

router.get(
  "/profile",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.CLIENT, ROLES.SELLER),
  getMyProfile,
);

router.get(
  "/management",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(userQuerySchema, "query"),
  getAllUsers,
);

router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.CLIENT, ROLES.SELLER),
  validate(userIdSchema, "params"),
  validate(updateUserSchema, "body"),
  updateUser,
);

router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(userIdSchema, "params"),
  deleteUser,
);

export default router;
