import { ValueOf, ModelDeclare } from "@ts/common.types";

export interface ITenant extends ModelDeclare<ITenant> {
  id?: number;
  name: string;
  userId?: number;
}
