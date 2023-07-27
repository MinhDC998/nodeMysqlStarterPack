import { ModelDeclare } from "@ts/common.types";

export interface IMedicine {
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
  tenantId?: number;
  unit: number;
  price: number;
  medicineGroup: string;
  image?: string | null;
}

export interface IModelMedicine
  extends ModelDeclare<IModelMedicine>,
    IMedicine {}

export type ISearchMedicine = Pick<IMedicine, "morbidness" | "name">;
