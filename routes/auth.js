import { Router } from 'express';
import { login, register, refresh, logout } from '../controllers/authController.js';
import { isAdminOrDev } from '../middleware/roleMiddleware.js'
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/register/user', authenticateJWT, isAdminOrDev, register);


export default router;