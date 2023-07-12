import xlsx from "xlsx";
import fs from "fs";
import path from "path";

import {
  IRole,
  ICreateRoleRequest,
  IListRoleRequest,
} from "@components/role/role.types";
import {
  failedResponse,
  successResponse,
  customRequest,
  customResponse,
} from "@utils/http";
import { sequelize } from "@models/.";

export const readFile = async (
  req: customRequest<never, ICreateRoleRequest>,
  res: customResponse<any>
) => {
  const transaction = await sequelize.transaction();

  try {
    const data = req.params;

    console.log({ data });

    var workbook = xlsx.readFile(path.resolve(__dirname, "./import_temp.xlsx"));
    var sheet_name_list = workbook.SheetNames;
    var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(xlData);

    // const result = await Role.create(data, { transaction });

    // transaction.commit();

    res.json(successResponse(""));
  } catch (err) {
    console.log({ err });
    transaction.rollback();

    res.json(failedResponse("Error", "Error"));
  }
};
