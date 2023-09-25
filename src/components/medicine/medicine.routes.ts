import express from "express";
import * as controller from "@components/medicine/medicine.controller";
import { singleFileUpload, uploadToS3 } from "@utils/multer";

import { DIR } from "@constants/dir.constants";

const router = express.Router();

router.post(
  "/import-excel",
  singleFileUpload("excel", DIR.EXCEL),
  controller.importExcel
);

router.get("/", controller.list);
router.get("/list-status", controller.listStatus);
router.post("/", uploadToS3("file", "access/medicines"), controller.create);

router.get("/:id", controller.detail);
router.post("/:id", uploadToS3("file", "access/medicines"), controller.update);
router.delete("/:id", controller.remove);

export default router;
