import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";

import {
  dashboardReportSchema,
  lowStockReportSchema,
  dateRangeReportSchema,
  limitReportSchema,
} from "../utils/schemas/reportSchema.js";

import {
  getDashboardReport,
  getLowStockReport,
  getSalesByDocument,
  getTopCustomers,
  getCategoryPerformance,
} from "../controllers/reportController.js";

const router = Router();

// Aplica autenticación JWT obligatoria para todas las rutas de este archivo
router.use(authenticateJWT);

// GET /reports/dashboard
router.get(
  "/dashboard",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.MANAGER),
  validate(dashboardReportSchema, "query"),
  getDashboardReport,
);

// GET /reports/low-stock
router.get(
  "/low-stock",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.MANAGER),
  validate(lowStockReportSchema, "query"),
  getLowStockReport,
);

// GET /reports/sales-by-document
router.get(
  "/sales-by-document",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(dateRangeReportSchema, "query"),
  getSalesByDocument,
);

// GET /reports/top-customers
router.get(
  "/top-customers",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(limitReportSchema, "query"),
  getTopCustomers,
);

// GET /reports/category-performance
router.get(
  "/category-performance",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getCategoryPerformance,
);

export default router;
