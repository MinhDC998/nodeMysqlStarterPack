import express from "express";

import excelRoutes from "@components/excel/excel.routes";
import userRoutes from "@components/user/user.routes";

const router = express.Router();

router.use("/excel", excelRoutes);
router.use("/users", userRoutes);

export default router.use("/api", router);
