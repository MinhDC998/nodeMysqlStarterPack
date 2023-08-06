import { DataTypes } from "sequelize";
import { sequelize } from ".";

import { IUser } from "@ts/user.types";
import ROLE from "@constants/role.constant";
import Tenant from "@models/tenant";

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
      type: DataTypes.ENUM,
      values: Object.values(ROLE).map((v) => v.toString()),
      allowNull: false,
    },
    displayName: DataTypes.STRING,
    tenantId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
  },
  { underscored: true }
);

// User.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

export default User;
