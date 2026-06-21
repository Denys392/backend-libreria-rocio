import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";

import {
  dashboardReportSchema,
  lowStockReportSchema,
  dateRangeReportSchema,
  limitReportSchema
} from "../utils/schemas/reportSchema.js";

import {
  getDashboardReport,
  getLowStockReport,
  getSalesByDocument,
  getTopCustomers,
  getCategoryPerformance,
} from "../controllers/reportController.js";

const router = Router();

router.use(authenticateJWT);

/**
 * @openapi
 * /reports/dashboard:
 *   get:
 *     summary: Reporte general de dashboard
 *     description: Devuelve un resumen financiero (ventas vs compras), los productos más vendidos y la tendencia de ventas agrupada por periodo. Por defecto cubre los últimos 30 días. Accesible para roles OWNER, ADMIN, DEV o MANAGER.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (AAAA-MM-DD). Por defecto, hace 30 días.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (AAAA-MM-DD). Por defecto, hoy.
 *       - in: query
 *         name: topLimit
 *         schema:
 *           type: integer
 *           maximum: 50
 *           default: 5
 *         description: Cantidad de productos más vendidos a incluir.
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *         description: Periodo de agrupación para la tendencia de ventas.
 *     responses:
 *       200:
 *         description: Reporte de dashboard generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date_range:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       example: "2026-05-22 00:00:00"
 *                     end:
 *                       type: string
 *                       example: "2026-06-21 23:59:59"
 *                 grouped_by:
 *                   type: string
 *                   example: day
 *                 financial_summary:
 *                   type: object
 *                   properties:
 *                     sales:
 *                       type: object
 *                       properties:
 *                         total_sales:
 *                           type: string
 *                           example: "1500.00"
 *                         total_sales_count:
 *                           type: integer
 *                           example: 42
 *                     purchases:
 *                       type: object
 *                       properties:
 *                         total_purchases:
 *                           type: string
 *                           example: "800.00"
 *                         total_purchase_orders_count:
 *                           type: integer
 *                           example: 5
 *                     net_profit:
 *                       type: number
 *                       example: 700
 *                 top_selling_products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       total_units_sold:
 *                         type: integer
 *                       total_revenue:
 *                         type: number
 *                 sales_trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       period:
 *                         type: string
 *                         example: "2026-06-20"
 *                       total_orders:
 *                         type: integer
 *                       total_revenue:
 *                         type: number
 *                       average_ticket:
 *                         type: number
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/dashboard",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.MANAGER),
  validate(dashboardReportSchema, "query"), 
  getDashboardReport,
);

/**
 * @openapi
 * /reports/low-stock:
 *   get:
 *     summary: Reporte de productos con stock bajo
 *     description: Devuelve los productos cuyo stock es menor o igual al umbral indicado, ordenados de menor a mayor stock. Accesible para roles OWNER, ADMIN, DEV o MANAGER.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Umbral de stock mínimo a considerar como "bajo".
 *     responses:
 *       200:
 *         description: Reporte de stock bajo generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alert_count:
 *                   type: integer
 *                   example: 4
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       name:
 *                         type: string
 *                         example: Cuaderno A4 100 hojas
 *                       stock:
 *                         type: integer
 *                         example: 3
 *                       price:
 *                         type: number
 *                         example: 9.90
 *                       category_name:
 *                         type: string
 *                         nullable: true
 *                         example: Útiles escolares
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/low-stock",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV, ROLES.MANAGER),
  validate(lowStockReportSchema, "query"),
  getLowStockReport,
);

/**
 * @openapi
 * /reports/sales-by-document:
 *   get:
 *     summary: Reporte de ventas agrupadas por tipo de documento
 *     description: Devuelve el total de ventas e ingresos agrupados por tipo de comprobante (BOLETA, FACTURA, TICKET, etc.) en un rango de fechas. Por defecto cubre los últimos 30 días. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (AAAA-MM-DD). Por defecto, hace 30 días.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (AAAA-MM-DD). Por defecto, hoy.
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   document_type:
 *                     type: string
 *                     example: BOLETA
 *                   total_orders:
 *                     type: integer
 *                     example: 30
 *                   total_revenue:
 *                     type: number
 *                     example: 1200.50
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/sales-by-document",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(dateRangeReportSchema, "query"),
  getSalesByDocument,
);

/**
 * @openapi
 * /reports/top-customers:
 *   get:
 *     summary: Reporte de clientes con mayor compra
 *     description: Devuelve el listado de los clientes que más han gastado en el sistema, ordenados de mayor a menor. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           maximum: 100
 *           default: 5
 *         description: Cantidad de clientes a devolver.
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 3
 *                   email:
 *                     type: string
 *                     example: cliente2@correo.com
 *                   customer_name:
 *                     type: string
 *                     nullable: true
 *                     example: Juan Pérez
 *                   total_purchases:
 *                     type: integer
 *                     example: 8
 *                   total_spent:
 *                     type: number
 *                     example: 450.30
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/top-customers",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(limitReportSchema, "query"),
  getTopCustomers,
);

/**
 * @openapi
 * /reports/category-performance:
 *   get:
 *     summary: Reporte de rendimiento por categoría
 *     description: Devuelve la cantidad de artículos vendidos e ingresos generados por cada categoría de productos, ordenados de mayor a menor ingreso. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   category_name:
 *                     type: string
 *                     example: Útiles escolares
 *                   total_items_sold:
 *                     type: integer
 *                     example: 120
 *                   total_revenue:
 *                     type: number
 *                     example: 980.50
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/category-performance",
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getCategoryPerformance,
);

export default router;