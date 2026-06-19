import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { permitRoles } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/roles.js';

const router = Router();
//users

router.get('/profile', (req, res) => {
  permitRoles(ROLES.ADMIN, ROLES.DEV, ROLES.CLIENT),
  res.json({ message: `Este es tu perfil, usuario ` });
});

router.get('/admin-or-biblio',
  authenticateJWT,
  permitRoles(ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "¡Bienvenido, administrador o bibliotecario!" });
  }
);

export default router;