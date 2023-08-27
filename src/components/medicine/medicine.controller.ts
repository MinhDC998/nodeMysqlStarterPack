import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

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

import {
  IMedicine,
  ISearchMedicine,
  IMedicineListResponse,
} from "@ts/medicine.types";
import { IMorbidness } from "@ts/morbidness.types";

import Medicine from "@models/medicine";
import Morbidness from "@models/morbidness";
import { uppercaseFirstLetter } from "@utils/collection";
import { EXCEL_MEDICINE_STATUS } from "@constants/medicine.constants";

interface IResExcelData {
  data: IMedicine[];
  morbidNessName: string[];
  isEmptyMedicine: boolean;
  isEmptyMorbidness: boolean;
  dataUpdate?: IMedicine[];
}

const getKeysFromExcelFile = (
  tenantId: number,
  file: Express.Multer.File
): IResExcelData => {
  const workbook = xlsx.readFile(path.resolve(process.cwd(), file.path));
  const sheet_name_list = workbook.SheetNames;

  const xlData: Array<Array<string>> = xlsx.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]],
    {
      header: 1,
    }
  );

  const data: IMedicine[] = [];
  const morbidNessName: string[] = [];
  const dataUpdate: IMedicine[] = [];

  let isEmptyMedicine = false;
  let isEmptyMorbidness = false;

  for (let i = 0; i < xlData.length; i++) {
    if (i === 0) continue;
    const v = xlData[i];

    if (!v[4] || !v[3]) {
      isEmptyMedicine = true;
      console.log(v[3], v[4], i);

      return { data, morbidNessName, isEmptyMedicine, isEmptyMorbidness };
    }

    if (!v[6]) {
      console.log(v[6], i);
      isEmptyMorbidness = true;

      return { data, morbidNessName, isEmptyMedicine, isEmptyMorbidness };
    }

    const excelMedicineData = {
      name: v[3],
      specificDisease: v[7],
      symptoms: v[4],
      medicineCode: v[4],
      medicineName: v[3],
      ingredients: v[5],
      specificObject: v[8],
      morbidness: v[6],
      dosage: v[10],
      note: v[11],
      tenantId,
      price: 0,
      unit: 0,
      medicineGroup: v[2],
      diseaseStatus: v[9],
    };

    switch (+v[0]) {
      case EXCEL_MEDICINE_STATUS.INSERT:
        data.push(excelMedicineData);
        break;

      default:
        dataUpdate.push(excelMedicineData);
        break;
    }

    if (v[5]) {
      v[5].split(",").forEach((name: string) => {
        const morName = uppercaseFirstLetter(name).trim().toLowerCase();

        if (!morbidNessName.includes(morName)) morbidNessName.push(morName);
      });
    }
  }

  if (fs.existsSync(file.path)) fs.rmSync(file.path, { recursive: true });

  return {
    data,
    morbidNessName,
    isEmptyMedicine,
    isEmptyMorbidness,
    dataUpdate,
  };
};

const insertMorbidness = (morbidnessName: string[], tenantId: number): void => {
  Morbidness.findAll({
    where: { name: { [Op.in]: morbidnessName }, tenantId },
  }).then((morbidness) => {
    const insertNameData = [...morbidnessName];
    morbidness.forEach((v) => {
      if (morbidnessName.includes(v.name)) {
        insertNameData.slice(
          morbidnessName.findIndex((name) => name === v.name)
        );
      }
    });

    const data: IMorbidness[] = insertNameData.map((v) => ({
      name: v,
      tenantId,
      morbidnessCode: v,
    }));

    Morbidness.bulkCreate(data, { ignoreDuplicates: true });
  });
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

        const {
          data,
          morbidNessName,
          isEmptyMedicine,
          isEmptyMorbidness,
          dataUpdate,
        } = getKeysFromExcelFile(+req.headers["tid"], req.file);

        if (isEmptyMedicine || isEmptyMorbidness) {
          res.json(
            failedResponse(
              "Tên thuốc hoặc bệnh không được để trống",
              "RequiredField"
            )
          );
          return;
        }

        const update =
          dataUpdate?.map((v) => {
            Medicine.update(v, { where: { medicineCode: v.medicineCode } });
          }) || [];

        Promise.all([
          data && Medicine.bulkCreate(data, { ignoreDuplicates: true }),
          morbidNessName &&
            insertMorbidness(morbidNessName, +req.headers["tid"]),
          dataUpdate && update,
        ])
          .then(([medicines, morbidness]) => {
            transaction.commit();

            res.json(
              successResponse({
                medicines,
                morbidness,
              })
            );
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
    const {
      offset,
      limit,
      morbidness,
      key,
      specificObject: specificObjectInput,
      diseaseStatus: diseaseStatusInput,
    } = req.query;

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

    const where = [
      {
        ...(key && {
          [Op.or]: [
            { name: { [Op.like]: `%${key}%` } },
            { ingredients: { [Op.like]: `%${key}%` } },
          ],
        }),
        ...(req.headers["tid"] && { tenant_id: req.headers["tid"] }),
        ...(specificObjectInput && {
          specific_object: { [Op.like]: `%${specificObjectInput}%` },
        }),
        ...(diseaseStatusInput && {
          disease_status: { [Op.like]: `%${diseaseStatusInput}%` },
        }),
      },
      morbidness
        ? sequelize.literal("MATCH (morbidness) AGAINST (:morbidness)")
        : {},
    ];

    const condition = {
      offset: +offset,
      limit: +limit,
      where,
      replacements: {
        morbidness: morbidness.replace(",", " "),
      },
      order: [["id", "desc"]],
    };

    // @ts-ignore
    const result = await Medicine.findAndCountAll(condition);

    const specificObject: string[] = [];
    const diseaseStatus: string[] = [];

    // let total = 0;

    // // @ts-ignore
    // count.forEach(
    //   (v: {
    //     count: number;
    //     specificObject: string | null;
    //     diseaseStatus: string | null;
    //   }) => {
    //     total += v.count;

    //     if (v.diseaseStatus && !diseaseStatus.includes(v.diseaseStatus))
    //       diseaseStatus.push(v.diseaseStatus);
    //     if (v.specificObject && !diseaseStatus.includes(v.specificObject))
    //       specificObject.push(v.specificObject);
    //   }
    // );

    // const responseList: IMedicineListResponse = {
    //   rows,
    //   count: total,
    //   diseaseStatus,
    //   specificObject,
    // };

    res.json(successResponse(result));
  } catch (err) {
    console.log({ err });
    res.json(failedResponse("Error", "Error"));
  }
};

export const listStatus = async (
  req: requestQuery<TSearch<ISearchMedicine>>,
  res: customResponse<any>
) => {
  try {
    const { morbidness, key } = req.query;

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

    const where = [
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
    ];

    const condition = {
      where,
      replacements: {
        morbidness: morbidness.replace(",", " "),
      },
      attributes: ["diseaseStatus", "specificObject"],
      group: ["diseaseStatus", "specificObject"],
    };

    const result = await Medicine.findAll(condition);

    const specificObject: string[] = [];
    const diseaseStatus: string[] = [];

    result.forEach((value) => {
      if (value.diseaseStatus && !diseaseStatus.includes(value.diseaseStatus))
        diseaseStatus.push(value.diseaseStatus);
      if (value.specificObject && !diseaseStatus.includes(value.specificObject))
        specificObject.push(value.specificObject);
    });

    const responseList = {
      diseaseStatus,
      specificObject,
    };

    res.json(successResponse(responseList));
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

      inputUpdate.image = req.file?.filename || null;

      await Medicine.update(inputUpdate, { where: { id: +id }, transaction });

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
