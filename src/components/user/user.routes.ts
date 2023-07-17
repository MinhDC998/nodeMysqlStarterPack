import express from "express";

import * as controller from "@components/user/user.controller";
import { handleValidationError } from "@middleware/validation";

import { validationLoginRequest } from "./user.validation";

const router = express.Router();

router.post("/create", controller.create);
router.post(
  "/login",
  validationLoginRequest,
  handleValidationError,
  controller.login
);

export default router;
