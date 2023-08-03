import { ModelDeclare } from "@ts/common.types";

export interface IMorbidness {
  id?: number;
  name: string;
  morbidnessCode: string;
  tenantId?: number;
}
export interface IModelMorbidness
  extends ModelDeclare<IModelMorbidness>,
    IMorbidness {}
