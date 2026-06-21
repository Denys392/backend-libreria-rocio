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

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createSupplyOrderSchema, "body"),
  createSupplyOrder,
);

router.get(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllSupplyOrders,
);

export default router;
