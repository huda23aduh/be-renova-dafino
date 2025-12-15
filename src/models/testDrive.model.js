import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Car from "./car.model.js";

const TestDrive = sequelize.define(
  "TestDrive",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    test_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    test_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "test_drives",
  }
);

// Associations
TestDrive.belongsTo(User, { foreignKey: "user_id" });
TestDrive.belongsTo(Car, { foreignKey: "car_id" });

export default TestDrive;
