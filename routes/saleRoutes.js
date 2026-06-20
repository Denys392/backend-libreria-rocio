import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import { createSale, getAllSales } from "../controllers/saleController.js";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.CLIENT, ROLES.ADMIN, ROLES.DEV, ROLES.SELLER),
  createSale,
);

router.get(
  "/",
  authenticateJWT,
  permitRoles(ROLES.CLIENT, ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllSales,
);

export default router;
