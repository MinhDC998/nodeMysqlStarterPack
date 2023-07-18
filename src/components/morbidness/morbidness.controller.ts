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
import Morbidness from "@models/morbidness";

import { IMorbidness } from "@ts/morbidness.types";

export const create = async (
  req: requestBody<IMorbidness>,
  res: customResponse<IMorbidness>
) => {
  const transaction = await sequelize.transaction();

  try {
    const data = req.body;

    console.log({ data });

    const result = await Morbidness.create(data, { transaction });

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
    const result = await Morbidness.findAndCountAll({
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
    const result = await Morbidness.findByPk(req.params.id);

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
  req: customRequest<{ id: string }, IMorbidness>,
  res: customResponse<any>
) => {
  try {
    sequelize.transaction(async (transaction: any) => {
      const { id } = req.params;
      const inputUpdate = req.body;

      await Morbidness.update(inputUpdate, { where: { id }, transaction });

      res.json(successResponse(await Morbidness.findByPk(id)));
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

      await Morbidness.destroy({ where: { id }, transaction });

      res.json(successResponse(true));
    });
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};
