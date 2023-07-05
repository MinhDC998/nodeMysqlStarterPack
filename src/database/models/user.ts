import { DataTypes, CreationOptional } from "sequelize";
import { sequelize } from ".";

import { IUser } from "@ts/user.types";

export default sequelize.define<IUser>("User", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayName: DataTypes.STRING,
});
