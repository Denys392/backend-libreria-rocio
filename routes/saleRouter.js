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

// Aplica el middleware de autenticación a todas las rutas de este módulo
router.use(authenticateJWT);

// GET /sales
router.get(
  "/",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER),
  validate(saleQuerySchema, "query"),
  getAllSales,
);

// GET /sales/my-purchases
router.get(
  "/my-purchases",
  permitRoles(ROLES.CLIENT, ROLES.ADMIN),
  validate(saleQuerySchema, "query"),
  getMyPurchases,
);

// GET /sales/:id
router.get(
  "/:id",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER, ROLES.CLIENT),
  validate(saleIdSchema, "params"),
  getSaleById,
);

// POST /sales
router.post(
  "/",
  permitRoles(ROLES.CLIENT, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER),
  validate(createSaleSchema, "body"),
  createSale,
);

export default router;
