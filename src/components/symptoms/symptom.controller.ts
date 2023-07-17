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
import Symptom from "@models/symptoms";

import { ISymptom } from "@ts/symptoms.types";

export const create = async (
  req: requestBody<ISymptom>,
  res: customResponse<ISymptom>
) => {
  const transaction = await sequelize.transaction();

  try {
    const data = req.body;
    const result = await Symptom.create(data, { transaction });

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
    const result = await Symptom.findAndCountAll({
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
    const result = await Symptom.findByPk(req.params.id);

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
  req: customRequest<{ id: string }, ISymptom>,
  res: customResponse<any>
) => {
  try {
    sequelize.transaction(async (transaction: any) => {
      const { id } = req.params;
      const inputUpdate = req.body;

      await Symptom.update(inputUpdate, { where: { id }, transaction });

      res.json(successResponse(await Symptom.findByPk(id)));
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

      await Symptom.destroy({ where: { id }, transaction });

      res.json(successResponse(true));
    });
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};
