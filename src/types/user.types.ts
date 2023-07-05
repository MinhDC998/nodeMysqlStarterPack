import { ValueOf, ModelDeclare } from "@ts/common.types";
import ROLE from "@constants/role.constant";

export interface IUser extends ModelDeclare<IUser> {
  id?: number;
  username: string;
  password: string;
  displayName: string;
  role: ValueOf<typeof ROLE>;
}
