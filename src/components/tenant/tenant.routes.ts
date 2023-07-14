import express from "express";
import * as tenantController from "@components/tenant/tenant.controller";

const router = express.Router();

router.get("/", tenantController.list);
router.post("/", tenantController.create);

router.get("/:id", tenantController.detail);
router.post("/:id", tenantController.update);
router.delete("/:id", tenantController.remove);

export default router;
