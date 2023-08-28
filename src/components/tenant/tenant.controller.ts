import {
  failedResponse,
  successResponse,
  customResponse,
  requestBody,
  requestParams,
  requestQuery,
  customRequest,
} from "@utils/http";
import { sequelize } from "@models/.";

import { TENANT_STATUS } from "@constants/tenant.constant";
import { ITenant, IInputTenant } from "@ts/tenant.types";

import Tenant from "@models/tenant";
import User from "@models/user";
import { Op } from "sequelize";

export const create = async (
  req: requestBody<IInputTenant>,
  res: customResponse<ITenant>
) => {
  const transaction = await sequelize.transaction();

  try {
    const data = req.body;
    const result = await Tenant.create({ name: data.name }, { transaction });
    data.usersName && addUsersToTenant(data.usersName, result.id);

    transaction.commit();

    res.json(successResponse(result));
  } catch (err) {
    transaction.rollback();

    res.json(failedResponse("Error", "Error"));
  }
};

export const update = async (
  req: customRequest<{ id: number }, IInputTenant>,
  res: customResponse<any>
) => {
  try {
    sequelize.transaction(async (transaction: any) => {
      const { id } = req.params;
      const { name, status, usersName } = req.body;

      await Tenant.update({ name, status }, { where: { id }, transaction });

      usersName && addUsersToTenant(usersName, id);

      res.json(successResponse(await Tenant.findByPk(id)));
    });
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};

export const list = async (
  req: requestQuery<{ offset: number; limit: number }>,
  res: customResponse<any>
) => {
  try {
    const { offset, limit } = req.query;
    const result = await Tenant.findAndCountAll({
      offset: +offset,
      limit: +limit,
      where: { status: TENANT_STATUS.ACTIVATED },
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
    const result = await Tenant.findAll({
      where: { status: TENANT_STATUS.ACTIVATED },
    });

    res.json(successResponse(result));
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};

export const detail = async (
  req: requestParams<{ id: string }>,
  res: customResponse<any>
) => {
  try {
    const result = await Tenant.findByPk(req.params.id);

    if (!result) {
      res.json(failedResponse("Not Found", "NotFound"));
      return;
    }

    res.json(successResponse(result));
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};

export const remove = async (
  req: requestParams<{ id: string }>,
  res: customResponse<any>
) => {
  try {
    sequelize.transaction(async (transaction: any) => {
      const { id } = req.params;

      await Tenant.destroy({ where: { id }, transaction });

      res.json(successResponse(true));
    });
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};

export const addUsersToTenant = async (usersName: string[], tenant: any) => {
  User.update({ tenantId: null }, { where: { tenantId: tenant } }).then(() => {
    User.update(
      { tenantId: tenant },
      { where: { username: { [Op.in]: usersName } } }
    );
  });
};
