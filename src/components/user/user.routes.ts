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
router.get("/users-tenant", controller.getUsersInTenant);

router.post("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
