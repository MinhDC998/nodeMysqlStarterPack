import {
  DataTypes,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
export interface ICommonListRequest {
  offset: number | string;
  limit: number | string;
}

export type ValueOf<T> = T[keyof T];

export type ModelDeclare<M extends Model<any, any>> = Model<
  InferAttributes<M>,
  InferCreationAttributes<M>
>;
