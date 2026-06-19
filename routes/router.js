import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import categoryRoutes from './categoryRoute.js';
// import bookRoutes from './book.js';
// import roleRoutes from './role.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
// router.use('/books', bookRoutes);
// router.use('/roles', roleRoutes);

export default router;