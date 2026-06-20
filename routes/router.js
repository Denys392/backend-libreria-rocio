import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import categoryRoutes from './categoryRoute.js';
import providerRoutes from './providerRoute.js';
import productRoutes from './productRoute.js';
import supplyRoutes from './supplyRoutes.js';
import saleRoutes from './saleRoutes.js';
// import bookRoutes from './book.js';
// import roleRoutes from './role.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/providers', providerRoutes);
router.use('/products', productRoutes);
router.use('/supplies', supplyRoutes);
router.use('/sales', saleRoutes);

export default router;