import express from 'express';
import * as roleController from '@components/role/role.controller';

const router = express.Router();

router.get('/', roleController.list);
router.post('/', roleController.create);

router.get('/:id', roleController.detail);
router.post('/:id', roleController.update);
router.delete('/:id', roleController.remove);

export default router;