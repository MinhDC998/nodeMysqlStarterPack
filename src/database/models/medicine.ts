import { DataTypes } from "sequelize";
import { sequelize } from ".";

import Tenant from "@models/tenant";

import { IModelMedicine } from "@ts/medicine.types";

const Medicine = sequelize.define<IModelMedicine>(
  "Medicine",
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
    specificDisease: DataTypes.STRING,
    symptoms: DataTypes.STRING,
    medicineCode: DataTypes.STRING,
    medicineName: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    specificObject: DataTypes.STRING,
    morbidness: DataTypes.STRING,
    dosage: DataTypes.STRING,
    unit: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    medicineGroup: DataTypes.STRING,
    note: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  {
    underscored: true,
    indexes: [
      {
        type: "FULLTEXT",
        name: "text_idx",
        fields: ["morbidness"],
      },
    ],
  }
);

Medicine.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

export default Medicine;
