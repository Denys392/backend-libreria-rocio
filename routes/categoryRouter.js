import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from "../utils/schemas/categorySchema.js";

import {
  createCategory,
  getAllCategories,
  getCategoryByID,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

//categories

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Listar todas las categorías
 *     description: Devuelve el listado completo de categorías de productos. Endpoint público, no requiere autenticación.
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Listado de categorías obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Útiles escolares
 *                   description:
 *                     type: string
 *                     example: Productos para uso escolar y de oficina.
 *                   image:
 *                     type: string
 *                     nullable: true
 *                     example: http://localhost:3000/uploads/categories/image-1718999999999-123456789.jpg
 */
router.get("/", getAllCategories);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     description: Devuelve los datos de una categoría específica. Endpoint público, no requiere autenticación.
 *     tags:
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría.
 *     responses:
 *       200:
 *         description: Categoría encontrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Útiles escolares
 *                 description:
 *                   type: string
 *                   example: Productos para uso escolar y de oficina.
 *                 image:
 *                   type: string
 *                   nullable: true
 *                   example: http://localhost:3000/uploads/categories/image-1718999999999-123456789.jpg
 *       400:
 *         description: El ID proporcionado no es válido.
 *       404:
 *         description: La categoría solicitada no existe.
 */
router.get("/:id", validate(categoryIdSchema, "params"), getCategoryByID);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Crea una categoría de productos. Solo accesible para roles OWNER, ADMIN o DEV. Acepta una imagen opcional (multipart/form-data).
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Útiles escolares
 *               description:
 *                 type: string
 *                 example: Productos para uso escolar y de oficina.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la categoría (jpeg, jpg, png o webp, máx. 2MB).
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría creada exitosamente.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: Útiles escolares
 *                     description:
 *                       type: string
 *                       example: Productos para uso escolar y de oficina.
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: http://localhost:3000/uploads/categories/image-1718999999999-123456789.jpg
 *       400:
 *         description: Datos de entrada inválidos o imagen con formato no permitido.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(createCategorySchema, "body"),
  createCategory,
);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría existente
 *     description: Actualiza los datos de una categoría. Solo accesible para roles OWNER, ADMIN o DEV. Acepta una nueva imagen opcional (multipart/form-data).
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Útiles escolares
 *               description:
 *                 type: string
 *                 example: Productos para uso escolar y de oficina.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de la categoría (jpeg, jpg, png o webp, máx. 2MB).
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría actualizada exitosamente.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: Útiles escolares
 *                     description:
 *                       type: string
 *                       example: Productos para uso escolar y de oficina.
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: http://localhost:3000/uploads/categories/image-1718999999999-123456789.jpg
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       404:
 *         description: La categoría a actualizar no existe.
 */
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(categoryIdSchema, "params"),
  validate(updateCategorySchema, "body"),
  updateCategory,
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     description: Elimina permanentemente una categoría. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría a eliminar.
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría eliminada exitosamente.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       404:
 *         description: La categoría a eliminar no existe.
 */
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(categoryIdSchema, "params"),
  deleteCategory,
);

export default router;
