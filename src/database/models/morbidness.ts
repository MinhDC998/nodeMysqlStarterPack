import { DataTypes } from "sequelize";
import { sequelize } from ".";

import Tenant from "@models/tenant";

import { IModelMorbidness } from "@ts/morbidness.types";

const Morbidness = sequelize.define<IModelMorbidness>(
  "Morbidness",
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
    morbidnessCode: DataTypes.STRING,
  },
  { underscored: true }
);

Morbidness.belongsTo(Tenant, {
  foreignKey: "tenantId",
  as: "tenant",
  onDelete: "CASCADE",
});

export default Morbidness;
