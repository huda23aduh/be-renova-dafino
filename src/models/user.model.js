import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  },
  {
    tableName: "users"
  }
);

export default User;
