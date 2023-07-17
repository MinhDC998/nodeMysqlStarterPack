import express from "express";
import * as controller from "@components/morbidness/morbidness.controller";

const router = express.Router();

router.get("/", controller.list);
router.post("/", controller.create);

router.get("/:id", controller.detail);
router.post("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
