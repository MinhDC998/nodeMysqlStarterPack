import express from "express";
import * as userController from "@components/user/user.controller";

const router = express.Router();

router.post("/create", userController.create);
router.post("/login", userController.login);

export default router;
