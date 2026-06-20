import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { createProductSchema, updateProductSchema, productIdSchema } from "../utils/schemas/productSchema.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByProviderId,
  updateProduct,
  deleteProduct,
  getPublicProducts,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getPublicProducts);

//products
router.get(
  "/model",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllProducts,
);
router.get(
  "/:id",
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
