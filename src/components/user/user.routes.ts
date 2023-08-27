import express from "express";

import * as controller from "@components/user/user.controller";
import { handleValidationError } from "@middleware/validation";

import {
  validationLoginRequest,
  validationRegisterRequest,
} from "./user.validation";

const router = express.Router();

router.post(
  "/create",
  validationRegisterRequest,
  handleValidationError,
  controller.create
);

router.post(
  "/login",
  validationLoginRequest,
  handleValidationError,
  controller.login
);

router.get("/", controller.list);
router.get("/all", controller.listAll);

export default router;
