import { ValueOf, ModelDeclare } from "@ts/common.types";
import { TENANT_STATUS } from "@constants/tenant.constant";

export interface ITenant extends ModelDeclare<ITenant> {
  id?: number;
  name: string;
  userId?: number;
  status?: ValueOf<typeof TENANT_STATUS>;
}

export interface IInputTenant {
  name: string;
  status?: ValueOf<typeof TENANT_STATUS>;
  usersName: string[];
}
