import { ValueOf, ModelDeclare } from "@ts/common.types";
import ROLE from "@constants/role.constant";

export interface IUser extends ModelDeclare<IUser> {
  id?: number;
  username: string;
  password: string;
  displayName: string;
  role: ValueOf<typeof ROLE>;
  tenantId: number;
}

export type TLogin = Pick<IUser, "username" | "password">;
export type TResLogin = Omit<IUser, "id" | "password"> & { token: string };
export type TCreate = Omit<IUser, "id">;
