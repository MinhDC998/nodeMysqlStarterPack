import express from "express";

import { authenticateToken } from "@middleware/authentication";

import excelRoutes from "@components/medicine/medicine.routes";
import userRoutes from "@components/user/user.routes";
import tenantRoutes from "@components/tenant/tenant.routes";
import morbidnessRoutes from "@components/morbidness/morbidness.routes";
import symptomRoutes from "@components/symptoms/symptom.routes";

const router = express.Router();

router.use("/users", userRoutes);

router.use(authenticateToken);

router.use("/medicines", excelRoutes);
router.use("/tenants", tenantRoutes);
router.use("/morbidness", morbidnessRoutes);
router.use("/symptoms", symptomRoutes);

export default router.use("/api", router);
