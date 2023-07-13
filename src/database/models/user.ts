import { DataTypes } from "sequelize";
import { sequelize } from ".";

import Tenant from "@models/tenant";

import { IUser } from "@ts/user.types";

const User = sequelize.define<IUser>(
  "User",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  },
  { underscored: true }
);

User.hasMany(Tenant, { as: "tenant" });

export default User;
