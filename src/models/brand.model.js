import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Brand = sequelize.define(
  "Brand",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "brands",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
);

export default Brand;
