import { DataTypes } from "sequelize";
import { sequelize } from ".";

import Tenant from "@models/tenant";

import { ISymptom } from "@ts/symptoms.types";

const Symptom = sequelize.define<ISymptom>("Symptom", {
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
  symptomCode: DataTypes.STRING,
}, {underscored: true});

Symptom.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

export default Symptom;
