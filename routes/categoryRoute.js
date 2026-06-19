import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

import {
  createCategory,
  getAllCategories,
  getCategoryByID,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

//categories
router.get("/", getAllCategories);
router.get("/:id", getCategoryByID);

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  createCategory,
);

router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  updateCategory,
);

router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  deleteCategory,
);

export default router;
