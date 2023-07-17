import { body } from "express-validator";

export const validationLoginRequest = [
  body("username").exists().withMessage("Tên tài khoản không được bỏ trống"),
  body("password")
    .exists()
    .withMessage("Mật khẩu không được bỏ trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu tối thiểu 6 kí tự"),
];
