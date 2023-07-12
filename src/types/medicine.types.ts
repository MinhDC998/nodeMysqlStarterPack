import { ModelDeclare } from "@ts/common.types";

export interface IMedicine extends ModelDeclare<IMedicine> {
  id?: number;
  name: string;
  specificDisease: string;
  symptoms: string;
  medicineCode: string;
  medicineName: string;
  ingredients: string;
  specificObject: string;
  morbidness: string;
  dosage: string;
  note: string;
}
