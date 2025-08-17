import express from 'express';
import merchantRouter from './merchantRouter';
import endUserRouter from './endUserRouter';
import adminRouter from './adminRouter';

const routers = express.Router();

routers.use('/enduser', endUserRouter);
routers.use('/merchant', merchantRouter);
routers.use('/admin', adminRouter);

export default routers;