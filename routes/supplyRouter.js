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

/**
 * @openapi
 * /supplies:
 *   post:
 *     summary: Registrar una orden de suministro (compra a proveedor)
 *     description: Registra una nueva orden de abastecimiento y actualiza el inventario (stock) de los productos involucrados. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Suministros
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider_id
 *               - items
 *             properties:
 *               provider_id:
 *                 type: integer
 *                 example: 2
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - purchase_price
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 10
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 50
 *                     purchase_price:
 *                       type: number
 *                       format: float
 *                       example: 5.50
 *     responses:
 *       201:
 *         description: Orden de suministro procesada e inventario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orden de suministro procesada e inventario actualizado con éxito
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     provider_id:
 *                       type: integer
 *                       example: 2
 *                     total_invoice:
 *                       type: number
 *                       format: float
 *                       example: 275.00
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Datos de entrada inválidos (lista vacía, cantidades o precios inválidos).
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       404:
 *         description: El proveedor o alguno de los productos especificados no existe.
 */
router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createSupplyOrderSchema, "body"),
  createSupplyOrder,
);

/**
 * @openapi
 * /supplies:
 *   get:
 *     summary: Listar todas las órdenes de suministro
 *     description: Devuelve el listado completo de órdenes de abastecimiento registradas. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Suministros
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de órdenes de suministro obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 7
 *                   provider_id:
 *                     type: integer
 *                     example: 2
 *                   total_invoice:
 *                     type: number
 *                     format: float
 *                     example: 275.00
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllSupplyOrders,
);

export default router;
