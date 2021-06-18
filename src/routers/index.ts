import express from 'express';
import roleRoutes from '@components/role/role.routes';

const router = express.Router();

router.use('/roles', roleRoutes);

export default router;