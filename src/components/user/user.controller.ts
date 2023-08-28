import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

import { sequelize } from "@models/.";
import User from "@models/user";

import { TCreate, TLogin, TResLogin, TUpdate } from "@ts/user.types";
import roleConstant from "@constants/role.constant";

import {
  failedResponse,
  successResponse,
  customRequest,
  customResponse,
  requestBody,
  requestQuery,
} from "@utils/http";

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
  req: requestQuery<{ offset: number; limit: number; key: string }>,
  res: customResponse<any>
) => {
  try {
    const { offset, limit, key } = req.query;
    const result = await User.findAndCountAll({
      where: {
        role: { [Op.ne]: roleConstant.ADMIN },
        ...(key && {
          [Op.or]: [
            { username: { [Op.like]: `%${key}%` } },
            { displayName: { [Op.like]: `%${key}%` } },
          ],
        }),
      },
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
    const result = await User.findAll({
      where: { role: { [Op.ne]: roleConstant.ADMIN } },
    });

    res.json(successResponse(result));
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};

export const update = async (
  req: customRequest<{ id: string }, TUpdate>,
  res: customResponse<boolean>
) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (body.password) {
      body.password = await bcrypt.hash(
        body.password,
        SALT_ROUND ? +SALT_ROUND : 8
      );
    }

    await User.update(body, { where: { id } });

    res.json(successResponse(true));
  } catch (err) {
    console.log({ err });
    res.json(failedResponse("Error", "Error"));
  }
};

export const getUsersInTenant = async (
  req: requestQuery<{ tenantId: number }>,
  res: customResponse<any>
) => {
  try {
    console.log(req.query.tenantId);
    const result = await User.findAll({
      where: { tenantId: { [Op.eq]: req.query.tenantId } },
      attributes: ["username"],
    });

    res.json(successResponse(result));
  } catch (err) {
    console.log({ err });
    res.json(failedResponse("Error", "Error"));
  }
};
