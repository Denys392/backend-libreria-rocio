import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from "../utils/schemas/categorySchema.js";

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
router.get("/:id", validate(categoryIdSchema, "params"), getCategoryByID);

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createCategorySchema, "body"),
  createCategory,
);

router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(categoryIdSchema, "params"),
  validate(updateCategorySchema, "body"),
  updateCategory,
);

router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(categoryIdSchema, "params"),
  deleteCategory,
);

export default router;
