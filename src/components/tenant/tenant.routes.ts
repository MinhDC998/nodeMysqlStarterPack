import express from "express";
import * as controller from "@components/tenant/tenant.controller";

const router = express.Router();

router.get("/", controller.list);
router.get("/all", controller.listAll);
router.post("/", controller.create);
router.post("/attach-tenant", controller.addUserToTenant);

router.get("/:id", controller.detail);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
