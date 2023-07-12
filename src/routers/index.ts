import express from "express";
// import roleRoutes from '@components/role/role.routes';

import excelRoutes from "@components/excel/excel.routes";

const router = express.Router();

router.use(excelRoutes);

export default router;
