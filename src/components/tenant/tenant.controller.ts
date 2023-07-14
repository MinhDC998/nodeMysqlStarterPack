import Tenant from "@models/tenant";
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

import { ITenant } from "@ts/tenant.types";

export const create = async (
  req: requestBody<{ name: string }>,
  res: customResponse<ITenant>
) => {
  const transaction = await sequelize.transaction();

  try {
    const data = req.body;
    const result = await Tenant.create(data, { transaction });

    transaction.commit();

    res.json(successResponse(result));
  } catch (err) {
    transaction.rollback();

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

export const update = async (
  req: customRequest<{ id: string }, ITenant>,
  res: customResponse<any>
) => {
  try {
    sequelize.transaction(async (transaction: any) => {
      const { id } = req.params;
      const inputUpdate = req.body;

      await Tenant.update(inputUpdate, { where: { id }, transaction });

      res.json(successResponse(await Tenant.findByPk(id)));
    });
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
