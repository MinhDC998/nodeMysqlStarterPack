import express from "express";
import * as controller from "@components/medicine/medicine.controller";
import { singleFileUpload } from "@utils/multer";

const router = express.Router();

router.post("/import-excel", singleFileUpload("excel"), controller.importExcel);

router.get("/", controller.list);
router.post("/", controller.create);

router.get("/:id", controller.detail);
router.post("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
