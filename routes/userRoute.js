import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

import {
  getMyProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  getPublicProfileImage,
  getPrivateProfileImage,
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
  "/profile/image/:filename",
  getPublicProfileImage
);

// router.get(
//   "/profile/image/:filename",
//   authenticateJWT,
//   permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.CLIENT, ROLES.SELLER),
//   getPrivateProfileImage
// );

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
  uploadImage.single("image"),
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
