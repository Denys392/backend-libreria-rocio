import { Router } from "express";
import {
  login,
  register,
  registerByStaff,
  refresh,
  logout,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { registerSchema, loginSchema } from "../utils/schemas/authSchema.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registro público de clientes
 *     description: Permite que usuarios externos se registren en el sistema. Automáticamente se les asigna el rol CLIENT.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nombre
 *             properties:
 *               email:
 *                 type: string
 *                 example: cliente2@correo.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               direccion:
 *                 type: string
 *                 example: Av. Larco 456
 *               telefono:
 *                 type: string
 *                 example: "987654321"
 *     responses:
 *       201:
 *         description: Usuario registrado de manera exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente.
 *                 userId:
 *                   type: integer
 *                   example: 12
 *                 role:
 *                   type: string
 *                   example: CLIENT
 *       400:
 *         description: Datos de entrada inválidos o faltantes.
 *       409:
 *         description: Conflicto. El correo electrónico ya se encuentra registrado.
 */
router.post("/register", authLimiter, validate(registerSchema, "body"), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Autentica al usuario mediante correo y contraseña. Retorna un Access Token en el JSON y adjunta un Refresh Token mediante una cookie HTTP-Only.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: cliente2@correo.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Se devuelve el token de acceso y se genera la cookie de refresco.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOi...; Path=/; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Datos requeridos faltantes en la solicitud.
 *       401:
 *         description: Credenciales inválidas.
 */
router.post("/login", authLimiter, validate(loginSchema, "body"), login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refrescar token de acceso expirado
 *     description: Lee la cookie HTTP-Only refreshToken del navegador. Si es válida y activa, genera un nuevo Access Token de 60 minutos.
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Token renovado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: No autorizado (cookie inexistente, expirada o usuario inactivo).
 */
router.post("/refresh", refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Destruye el Refresh Token en la base de datos y limpia la cookie de autenticación del navegador.
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada exitosamente.
 */
router.post("/logout", logout);

/**
 * @openapi
 * /auth/register/user:
 *   post:
 *     summary: Crear usuarios por el personal (Staff)
 *     description: Permite a usuarios con roles OWNER, ADMIN o DEV dar de alta nuevos usuarios con roles específicos. Los ADMIN y DEV no pueden asignar el rol OWNER.
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nombre
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin2@libreriarocio.com
 *               password:
 *                 type: string
 *                 example: AdminClave2026!
 *               nombre:
 *                 type: string
 *                 example: Carlos Mendoza
 *               role:
 *                 type: string
 *                 enum:
 *                   - OWNER
 *                   - ADMIN
 *                   - DEV
 *                   - CLIENT
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente por el staff.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado exitosamente.
 *                 userId:
 *                   type: integer
 *                   example: 15
 *                 role:
 *                   type: string
 *                   example: ADMIN
 *       401:
 *         description: Token faltante, expirado o manipulado.
 *       403:
 *         description: Permisos insuficientes (rol no permitido o intento ilegal de asignar un rol OWNER).
 *       409:
 *         description: El correo electrónico ya existe.
 */
router.post(
  "/register/user",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(registerSchema, "body"),
  registerByStaff,
);

export default router;