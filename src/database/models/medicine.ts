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
    specificDisease: DataTypes.TEXT,
    symptoms: DataTypes.TEXT,
    medicineCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    medicineName: {
      type: DataTypes.STRING,
      unique: true,
    },
    ingredients: DataTypes.TEXT,
    specificObject: DataTypes.TEXT,
    morbidness: DataTypes.TEXT,
    dosage: DataTypes.STRING,
    unit: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    medicineGroup: DataTypes.TEXT,
    note: DataTypes.TEXT,
    image: DataTypes.STRING,
    diseaseStatus: DataTypes.STRING,
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

Medicine.belongsTo(Tenant, {
  foreignKey: "tenantId",
  as: "tenant",
  onDelete: "CASCADE",
});

export default Medicine;
