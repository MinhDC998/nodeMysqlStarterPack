import express from "express";
import { readFile } from "@components/excel/excel.controller";

const router = express.Router();

router.get("/", readFile);

export default router;
