import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { createSupplyOrderSchema } from "../utils/schemas/supplySchema.js";

import {
  createSupplyOrder,
  getAllSupplyOrders,
} from "../controllers/supplyController.js";

const router = Router();

// Aplica autenticación JWT obligatoria para todos los endpoints de este archivo
router.use(authenticateJWT);

// GET /supplies
router.get(
  "/",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllSupplyOrders,
);

// POST /supplies
router.post(
  "/",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createSupplyOrderSchema, "body"),
  createSupplyOrder,
);

export default router;
