import express from "express";
import * as controller from "@components/user/user.controller";

const router = express.Router();

router.post("/create", controller.create);
router.post("/login", controller.login);

export default router;
