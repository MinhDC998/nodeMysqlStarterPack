import { ModelDeclare } from "@ts/common.types";

export interface IMorbidness extends ModelDeclare<IMorbidness> {
  id?: number;
  name: string;
  morbidnessCode: string;
  tenantId?: number;
}
