import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { permitRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";
import validate from "../middleware/validateMiddleware.js";
import { createProviderSchema, updateProviderSchema, providerIdSchema, providerDocumentSchema } from "../utils/schemas/providerSchema.js";

import {
  createProvider,
  getAllProviders,
  getProviderByID,
  getProviderByDocument,
  updateProvider,
  deleteProvider,
} from "../controllers/providerController.js";

const router = Router();

//providers
router.get(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  getAllProviders,
);
router.get(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerIdSchema, "params"),
  getProviderByID,
);

router.get(
  "/document/:identifier",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerDocumentSchema, "params"),
  getProviderByDocument,
);

router.post(
  "/",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(createProviderSchema, "body"),
  createProvider,
);
router.put(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerIdSchema, "params"),
  validate(updateProviderSchema, "body"),
  updateProvider,
);
router.delete(
  "/:id",
  authenticateJWT,
  permitRoles(ROLES.OWNER, ROLES.ADMIN, ROLES.DEV),
  validate(providerIdSchema, "params"),
  deleteProvider,
);

export default router;
