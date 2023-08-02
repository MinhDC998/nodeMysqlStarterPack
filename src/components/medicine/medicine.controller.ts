import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { Op, Sequelize } from "sequelize";

import {
  failedResponse,
  successResponse,
  customRequest,
  customResponse,
  requestBody,
  requestQuery,
  requestParams,
  TSearch,
} from "@utils/http";
import { sequelize } from "@models/.";
import { IMedicine, ISearchMedicine } from "@ts/medicine.types";
import Medicine from "@models/medicine";

const getKeysFromExcelFile = (tenantId: number, file: Express.Multer.File) => {
  const workbook = xlsx.readFile(path.resolve(process.cwd(), file.path));
  const sheet_name_list = workbook.SheetNames;

  const xlData: Array<Array<string>> = xlsx.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]],
    {
      header: 1,
    }
  );

  const data: IMedicine[] = [];

  xlData.forEach((v, i) => {
    if (i === 0) return;

    data.push({
      name: v[2],
      specificDisease: v[6],
      symptoms: v[3],
      medicineCode: v[3],
      medicineName: v[2],
      ingredients: v[4],
      specificObject: v[7],
      morbidness: v[5],
      dosage: v[9],
      note: v[10],
      tenantId,
      price: 0,
      unit: 0,
      medicineGroup: v[1],
    });
  });

  if (fs.existsSync(file.path)) fs.rmSync(file.path, { recursive: true });

  return data;
};

export const importExcel = async (
  req: customRequest<never, any>,
  res: customResponse<any>
) => {
  sequelize
    .transaction()
    .then((transaction) => {
      try {
        if (!req.headers["tid"]) {
          res.json(failedResponse("Không tìm thấy nhà thuốc", "Error"));
          return;
        }

        if (!req.file) {
          res.json(failedResponse("Không có file", "Error"));
          return;
        }

        const xlData = getKeysFromExcelFile(+req.headers["tid"], req.file);
        res.json(successResponse(xlData));

        Medicine.bulkCreate(xlData)
          .then((r) => {
            transaction.commit();

            res.json(successResponse(r));
          })
          .catch((err) => {
            console.log({ err });

            res.json(failedResponse("Error", "Error"));
          });
      } catch (err) {
        console.log({ err });
        transaction.rollback();

        res.json(failedResponse("Error", "Error"));
      }
    })
    .catch((err) => {
      console.log({ err });
      res.json(failedResponse("Error", "Error"));
    });
};

export const create = async (
  req: requestBody<IMedicine>,
  res: customResponse<IMedicine>
) => {
  sequelize
    .transaction()
    .then(async (transaction) => {
      if (!req.headers["tid"]) {
        res.json(failedResponse("Không tìm thấy nhà thuốc", "Error"));
        return;
      }

      const data = req.body;

      data.name = "";
      data.image = req.file?.filename || null;
      data.tenantId = +req.headers["tid"];

      const result = await Medicine.create(data, { transaction });

      transaction.commit();

      res.json(successResponse(result));
    })
    .catch(() => {
      res.json(failedResponse("Error", "Error"));
    });
};

export const list = async (
  req: requestQuery<TSearch<ISearchMedicine>>,
  res: customResponse<any>
) => {
  try {
    const { offset, limit, morbidness, key } = req.query;

    const morbidnessOr = [];

    if (morbidness) {
      morbidness.split(",").forEach((v) => {
        morbidnessOr.push({
          [Op.or]: {
            morbidness: { [Op.like]: `%${v}%` },
          },
        });
      });
    }

    const condition = {
      offset: +offset,
      limit: +limit,
      where: [
        {
          ...(key && {
            [Op.or]: [
              { name: { [Op.like]: `%${key}%` } },
              { ingredients: { [Op.like]: `%${key}%` } },
            ],
          }),
          ...(req.headers["tid"] && { tenant_id: req.headers["tid"] }),
        },
        morbidness
          ? sequelize.literal("MATCH (morbidness) AGAINST (:morbidness)")
          : {},
      ],
      replacements: {
        morbidness: morbidness.replace(",", " "),
      },
      order: [["id", "desc"]],
    };

    // @ts-ignore
    const result = await Medicine.findAndCountAll(condition);

    res.json(successResponse(result));
  } catch (err) {
    console.log({ err });
    res.json(failedResponse("Error", "Error"));
  }
};

export const detail = async (
  req: requestParams<{ id: string }>,
  res: customResponse<any>
) => {
  try {
    const result = await Medicine.findByPk(req.params.id);

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
  req: customRequest<{ id: string }, IMedicine>,
  res: customResponse<any>
) => {
  try {
    sequelize.transaction(async (transaction: any) => {
      const { id } = req.params;
      const inputUpdate = req.body;

      await Medicine.update(inputUpdate, { where: { id }, transaction });

      res.json(successResponse(await Medicine.findByPk(id)));
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

      await Medicine.destroy({ where: { id }, transaction });

      res.json(successResponse(true));
    });
  } catch (err) {
    res.json(failedResponse("Error", "Error"));
  }
};
