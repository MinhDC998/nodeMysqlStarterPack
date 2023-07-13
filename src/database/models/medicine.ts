import { DataTypes } from "sequelize";
import { sequelize } from ".";

import Tenant from "@models/tenant";

import { IMedicine } from "@ts/medicine.types";

const Medicine = sequelize.define<IMedicine>("Medicine", {
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
  specificDisease: DataTypes.STRING,
  symptoms: DataTypes.STRING,
  medicineCode: DataTypes.STRING,
  medicineName: DataTypes.STRING,
  ingredients: DataTypes.STRING,
  specificObject: DataTypes.STRING,
  morbidness: DataTypes.STRING,
  dosage: DataTypes.STRING,
  note: DataTypes.STRING,
}, { underscored: true });

Medicine.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

export default Medicine;
