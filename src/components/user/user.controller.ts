import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { sequelize } from "@models/.";
import User from "@models/user";

import { TCreate, TLogin, TResLogin } from "@ts/user.types";

import {
  failedResponse,
  successResponse,
  customRequest,
  customResponse,
  requestBody,
  requestQuery,
} from "@utils/http";
import roleConstant from "@root/constants/role.constant";

const { SALT_ROUND, SECRET_KEY, EXPIRED_IN } = process.env;

export const create = async (
  req: requestBody<TCreate>,
  res: customResponse<any>
) => {
  const transaction = await sequelize.transaction();

  try {
    const data = req.body;

    const isExistUser = await User.findOne({
      where: { username: data.username },
    });

    if (isExistUser) {
      res.json(failedResponse("Tài khoản đã tồn tại", "FAILED"));
      return;
    }

    if (data.role === roleConstant.ADMIN) {
      res.json(
        failedResponse("Không được phép tạo tài khoản quản trị", "FAILED")
      );
      return;
    }

    data.password = await bcrypt.hash(
      data.password,
      SALT_ROUND ? +SALT_ROUND : 8
    );

    const result = await User.create(data, { transaction });

    transaction.commit();

    res.json(successResponse(result));
  } catch (err: any) {
    transaction.rollback();

    res.json(failedResponse(err.message, "Error"));
  }
};

export const login = async (
  req: requestBody<TLogin>,
  res: customResponse<TResLogin>
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.json(
        failedResponse("Sai tài khoản hoặc mật khẩu", "invalidCredentials")
      );
      return;
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY || "", {
      expiresIn: "24h",
    });

    const { displayName, role, tenantId } = user.toJSON();

    res.json(
      successResponse({
        username,
        displayName,
        role,
        token,
        tenantId,
      } as TResLogin)
    );
  } catch (err) {
    console.log({ err });
    res.json(failedResponse("Error", "Error"));
  }
};

export const list = async (
  req: requestQuery<{ offset: number; limit: number }>,
  res: customResponse<any>
) => {
  try {
    const { offset, limit } = req.query;
    const result = await User.findAndCountAll({
      offset: +offset,
      limit: +limit,
    });

    res.json(successResponse(result));
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};

export const listAll = async (
  req: requestQuery<unknown>,
  res: customResponse<any>
) => {
  try {
    const result = await User.findAll();

    res.json(successResponse(result));
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};
