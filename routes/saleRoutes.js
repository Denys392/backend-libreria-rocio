import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createSale,
  getAllSales,
  getMyPurchases,
  getSaleById,
} from "../controllers/saleController.js";
import {
  createSaleSchema,
  saleQuerySchema,
  saleIdSchema,
} from "../utils/schemas/saleSchema.js";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.CLIENT, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER),
  validate(createSaleSchema, "body"),
  createSale,
);

router.get(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER),
  validate(saleQuerySchema, "query"),
  getAllSales,
);

router.get(
  "/my-purchases",
  authenticateJWT,
  permitRoles(ROLES.CLIENT, ROLES.ADMIN),
  validate(saleQuerySchema, "query"),
  getMyPurchases,
);

router.get(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER, ROLES.CLIENT),
  validate(saleIdSchema, "params"),
  getSaleById,
);

export default router;
