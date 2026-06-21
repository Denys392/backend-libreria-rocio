import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from "../utils/schemas/categorySchema.js";

import {
  createCategory,
  getAllCategories,
  getCategoryByID,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

// GET /categories
router.get("/", getAllCategories);

// GET /categories/:id
router.get("/:id", validate(categoryIdSchema, "params"), getCategoryByID);

// POST /categories
router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(createCategorySchema, "body"),
  createCategory,
);

// PUT /categories/:id
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(categoryIdSchema, "params"),
  validate(updateCategorySchema, "body"),
  updateCategory,
);

// DELETE /categories/:id
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(categoryIdSchema, "params"),
  deleteCategory,
);

export default router;