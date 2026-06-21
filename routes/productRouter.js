import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

//products
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productFilterSchema,
} from "../utils/schemas/productSchema.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByProviderId,
  updateProduct,
  deleteProduct,
  getPublicProducts,
  getCatalogByCategories,
} from "../controllers/productController.js";

const router = Router();

import { productQuerySchema } from "../utils/schemas/productSchema.js";

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Listar productos públicos (catálogo)
 *     description: Devuelve un listado paginado de productos disponibles para la venta (con precio asignado). Endpoint público, no requiere autenticación.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto de búsqueda por nombre del producto.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página a consultar.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Cantidad de resultados por página.
 *     responses:
 *       200:
 *         description: Listado de productos obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_items:
 *                   type: integer
 *                   example: 48
 *                 total_pages:
 *                   type: integer
 *                   example: 5
 *                 current_page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
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
 *                       description:
 *                         type: string
 *                         example: Cuaderno cuadriculado de 100 hojas.
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 9.90
 *                       stock:
 *                         type: integer
 *                         example: 35
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: http://localhost:3000/uploads/products/image-1718999999999-123456789.jpg
 *                       category_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       provider_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 2
 *       400:
 *         description: Parámetros de consulta inválidos.
 */
router.get(
  "/", 
  validate(productQuerySchema, "query"), 
  getPublicProducts
);

/**
 * @openapi
 * /products/catalog-by-categories:
 *   get:
 *     summary: Obtener catálogo agrupado por categorías
 *     description: Devuelve todas las categorías junto con hasta 5 productos destacados de cada una (con un indicador `has_more` si existen más productos). Endpoint público, no requiere autenticación.
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Catálogo obtenido exitosamente.
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
 *                   has_more:
 *                     type: boolean
 *                     example: true
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         name:
 *                           type: string
 *                           example: Cuaderno A4 100 hojas
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 9.90
 *                         image:
 *                           type: string
 *                           nullable: true
 */
router.get(
  "/catalog-by-categories",
  getCatalogByCategories
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto público por ID
 *     description: Devuelve los datos de un producto disponible para la venta (con precio asignado). Endpoint público, no requiere autenticación. Si el producto no tiene precio asignado (no disponible para venta), se considera no encontrado.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del producto.
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: Cuaderno A4 100 hojas
 *                 description:
 *                   type: string
 *                   example: Cuaderno cuadriculado de 100 hojas.
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 9.90
 *                 stock:
 *                   type: integer
 *                   example: 35
 *                 image:
 *                   type: string
 *                   nullable: true
 *                 category_id:
 *                   type: integer
 *                   nullable: true
 *                 provider_id:
 *                   type: integer
 *                   nullable: true
 *       400:
 *         description: El ID proporcionado no es válido.
 *       404:
 *         description: El producto no existe o no está disponible para la venta.
 */
router.get(
  "/:id",
  validate(productIdSchema, "params"),
  getProductById
);


/**
 * @openapi
 * /products/model:
 *   get:
 *     summary: Listar todos los productos (administración)
 *     description: Devuelve un listado paginado de todos los productos, incluyendo aquellos sin precio asignado (no publicados). Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto de búsqueda por nombre del producto.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página a consultar.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Cantidad de resultados por página.
 *     responses:
 *       200:
 *         description: Listado de productos obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_items:
 *                   type: integer
 *                   example: 60
 *                 total_pages:
 *                   type: integer
 *                   example: 6
 *                 current_page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/model",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productQuerySchema, "query"),
  getAllProducts,
);

/**
 * @openapi
 * /products/category/{categoryId}:
 *   get:
 *     summary: Listar productos públicos por categoría
 *     description: Devuelve un listado paginado de productos disponibles para la venta que pertenecen a una categoría específica. Endpoint público, no requiere autenticación.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Listado de productos de la categoría obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_items:
 *                   type: integer
 *                 total_pages:
 *                   type: integer
 *                 current_page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: El ID de la categoría no es válido.
 */
router.get(
  "/category/:categoryId",
  validate(productFilterSchema("categoryId"), "params"),
  validate(productQuerySchema, "query"),
  getProductsByCategoryId
);

/**
 * @openapi
 * /products/model/category/{categoryId}:
 *   get:
 *     summary: Listar todos los productos por categoría (administración)
 *     description: Devuelve un listado paginado de todos los productos de una categoría, incluyendo los que no tienen precio asignado. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Listado de productos de la categoría obtenido exitosamente.
 *       400:
 *         description: El ID de la categoría no es válido.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/model/category/:categoryId",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productFilterSchema("categoryId"), "params"),
  getProductsByCategoryId,
);

/**
 * @openapi
 * /products/provider/{providerId}:
 *   get:
 *     summary: Listar productos por proveedor
 *     description: Devuelve el listado completo (sin paginar) de productos asociados a un proveedor específico. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del proveedor.
 *     responses:
 *       200:
 *         description: Listado de productos del proveedor obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: El ID del proveedor no es válido.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 */
router.get(
  "/provider/:providerId",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productFilterSchema("providerId"), "params"),
  getProductsByProviderId,
);


/**
 * @openapi
 * /products/model/{id}:
 *   get:
 *     summary: Obtener un producto por ID (administración)
 *     description: Devuelve los datos de cualquier producto, incluso si no tiene precio asignado (no publicado). Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del producto.
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       404:
 *         description: El producto solicitado no existe.
 */
router.get(
  "/model/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  getProductById,
);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un producto con stock inicial en 0. Solo accesible para roles OWNER, ADMIN o DEV. Acepta una imagen opcional (multipart/form-data).
 *     tags:
 *       - Productos
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
 *                 example: Cuaderno A4 100 hojas
 *               description:
 *                 type: string
 *                 example: Cuaderno cuadriculado de 100 hojas.
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 9.90
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               provider_id:
 *                 type: integer
 *                 example: 2
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (jpeg, jpg, png o webp, máx. 2MB).
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     name:
 *                       type: string
 *                       example: Cuaderno A4 100 hojas
 *                     stock:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: El nombre del producto es obligatorio o los datos enviados son inválidos.
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       409:
 *         description: Ya existe un producto con ese nombre.
 */
router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(createProductSchema, "body"),
  createProduct,
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     description: Actualiza los datos de un producto. Solo accesible para roles OWNER, ADMIN o DEV. Acepta una nueva imagen opcional (multipart/form-data). El stock no se modifica desde este endpoint (se gestiona vía órdenes de suministro y ventas).
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del producto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cuaderno A4 100 hojas
 *               description:
 *                 type: string
 *                 example: Cuaderno cuadriculado de 100 hojas.
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 10.50
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               provider_id:
 *                 type: integer
 *                 example: 2
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del producto (jpeg, jpg, png o webp, máx. 2MB).
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Datos inválidos (por ejemplo, nombre vacío).
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       404:
 *         description: El producto a actualizar no existe.
 *       409:
 *         description: Ya existe otro producto con ese nombre.
 */
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  uploadImage.single("image"),
  validate(productIdSchema, "params"),
  validate(updateProductSchema, "body"),
  updateProduct,
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina permanentemente un producto del sistema, incluyendo su imagen asociada. Solo accesible para roles OWNER, ADMIN o DEV.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del producto a eliminar.
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes para esta acción.
 *       404:
 *         description: El producto a eliminar no existe.
 */
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(productIdSchema, "params"),
  deleteProduct,
);

export default router;