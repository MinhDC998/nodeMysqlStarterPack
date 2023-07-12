import { DataTypes } from "sequelize";
import { sequelize } from ".";

import Tenant from "@models/tenant";

import { IMorbidness } from "@ts/morbidness.types";

const Morbidness = sequelize.define<IMorbidness>("Morbidness", {
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
  morbidnessCode: DataTypes.STRING,
});

Morbidness.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

export default Morbidness;
