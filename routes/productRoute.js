import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

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
  getProductById,
);

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  createProduct,
);
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  updateProduct,
);
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  deleteProduct,
);

export default router;
