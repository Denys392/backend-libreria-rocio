import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import {
  getDashboardReport,
  getLowStockReport,
  getSalesByDocument,
  getTopCustomers,
  getCategoryPerformance,
} from "../controllers/reportController.js";

const router = Router();

router.get(
  "/dashboard",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.MANAGER),
  getDashboardReport,
);

router.get(
  "/low-stock",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.MANAGER),
  getLowStockReport,
);

router.get(
  "/sales-by-document",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getSalesByDocument,
);

router.get(
  "/top-customers",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getTopCustomers,
);

router.get(
  "/category-performance",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getCategoryPerformance,
);

export default router;
