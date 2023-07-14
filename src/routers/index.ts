import express from "express";

import { authenticateToken } from "@middleware/authentication";

import excelRoutes from "@components/excel/excel.routes";
import userRoutes from "@components/user/user.routes";
import tenantRoutes from "@components/tenant/tenant.routes";

const router = express.Router();

router.use("/excel", excelRoutes);
router.use("/users", userRoutes);

router.use(authenticateToken);

router.use("/tenants", tenantRoutes);

export default router.use("/api", router);
