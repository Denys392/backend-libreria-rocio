import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";

import {
  createProviderSchema,
  updateProviderSchema,
  providerIdSchema,
  providerDocumentSchema,
} from "../utils/schemas/providerSchema.js";

import {
  createProvider,
  getAllProviders,
  getProviderByID,
  getProviderByDocument,
  updateProvider,
  deleteProvider,
} from "../controllers/providerController.js";

const router = Router();

// GET /providers
router.get(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllProviders,
);

// GET /providers/document/:identifier
router.get(
  "/document/:identifier",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerDocumentSchema, "params"),
  getProviderByDocument,
);

// GET /providers/:id
router.get(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerIdSchema, "params"),
  getProviderByID,
);

// POST /providers
router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createProviderSchema, "body"),
  createProvider,
);

// PUT /providers/:id
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerIdSchema, "params"),
  validate(updateProviderSchema, "body"),
  updateProvider,
);

// DELETE /providers/:id
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerIdSchema, "params"),
  deleteProvider,
);

export default router;
