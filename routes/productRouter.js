import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productFilterSchema,
  productQuerySchema,
} from "../utils/schemas/productSchema.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByProviderId,
  updateProduct,
  deleteProduct,
  getPublicProducts,
  getCatalogByCategories,
} from "../controllers/productController.js";

const router = Router();

// GET /products
router.get("/", validate(productQuerySchema, "query"), getPublicProducts);

// GET /products/catalog-by-categories
router.get("/catalog-by-categories", getCatalogByCategories);

// GET /products/model
router.get(
  "/model",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productQuerySchema, "query"),
  getAllProducts,
);

// GET /products/category/:categoryId
router.get(
  "/category/:categoryId",
  validate(productFilterSchema("categoryId"), "params"),
  validate(productQuerySchema, "query"),
  getProductsByCategoryId,
);

// GET /products/model/category/:categoryId
router.get(
  "/model/category/:categoryId",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productFilterSchema("categoryId"), "params"),
  getProductsByCategoryId,
);

// GET /products/provider/:providerId
router.get(
  "/provider/:providerId",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productFilterSchema("providerId"), "params"),
  getProductsByProviderId,
);

// GET /products/:id
router.get("/:id", validate(productIdSchema, "params"), getProductById);

// GET /products/model/:id
router.get(
  "/model/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  getProductById,
);

// POST /products
router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(createProductSchema, "body"),
  createProduct,
);

// PUT /products/:id
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(productIdSchema, "params"),
  validate(updateProductSchema, "body"),
  updateProduct,
);

// DELETE /products/:id
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  deleteProduct,
);

export default router;
