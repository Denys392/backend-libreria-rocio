import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";

//products
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productFilterSchema,
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

import { productQuerySchema } from "../utils/schemas/productSchema.js";

router.get(
  "/", 
  validate(productQuerySchema, "query"), 
  getPublicProducts
);

router.get(
  "/catalog-by-categories",
  getCatalogByCategories
);

router.get(
  "/:id",
  validate(productIdSchema, "params"),
  getProductById
);


router.get(
  "/model",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productQuerySchema, "query"),
  getAllProducts,
);

router.get(
  "/category/:categoryId",
  validate(productFilterSchema("categoryId"), "params"),
  validate(productQuerySchema, "query"),
  getProductsByCategoryId
);

router.get(
  "/model/category/:categoryId",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productFilterSchema("categoryId"), "params"),
  getProductsByCategoryId,
);

router.get(
  "/provider/:providerId",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productFilterSchema("providerId"), "params"),
  getProductsByProviderId,
);


router.get(
  "/model/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  getProductById,
);

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createProductSchema, "body"),
  createProduct,
);

router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  validate(updateProductSchema, "body"),
  updateProduct,
);

router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  deleteProduct,
);

export default router;