import { DataTypes } from "sequelize";
import { sequelize } from ".";

import User from "@models/user";

import { ITenant } from "@ts/tenant.types";

const Tenant = sequelize.define<ITenant>(
  "Tenant",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

Tenant.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Tenant;