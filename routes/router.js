import { Router } from 'express';
import authRouter from './authRouter.js';
import userRoutes from './userRouter.js';
import categoryRouter from './categoryRouter.js';
import providerRouter from './providerRouter.js';
import productRouter from './productRouter.js';
import supplyRouter from './supplyRouter.js';
import saleRouter from './saleRouter.js';
import reportRouter from './reportRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRoutes);
router.use('/categories', categoryRouter);
router.use('/providers', providerRouter);
router.use('/products', productRouter);
router.use('/supplies', supplyRouter);
router.use('/sales', saleRouter);
router.use('/reports', reportRouter);

export default router;