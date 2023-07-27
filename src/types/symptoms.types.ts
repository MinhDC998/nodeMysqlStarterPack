import { ModelDeclare } from "@ts/common.types";

export interface ISymptom extends ModelDeclare<ISymptom> {
  id?: number;
  name: string;
  symptomCode: string;
  symptomGroup: string;
  tenantId?: number;
}
