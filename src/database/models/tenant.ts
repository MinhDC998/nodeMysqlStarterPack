import { DataTypes } from "sequelize";
import { sequelize } from ".";

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
    status: DataTypes.SMALLINT,
  },
  { underscored: true }
);

export default Tenant;
