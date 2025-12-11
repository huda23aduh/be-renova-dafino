import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Brand from "./brand.model.js";

const Car = sequelize.define(
  "Car",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.UUID,
      references: {
        model: Brand,
        key: "id",
      },
    },
    model_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fuel_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transmission: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    kilometers: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gallery: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("gallery");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("gallery", JSON.stringify(value));
      },
    },
    interior: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("interior");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("interior", JSON.stringify(value));
      },
    },
    exterior: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("exterior");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("exterior", JSON.stringify(value));
      },
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("features");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("features", JSON.stringify(value));
      },
    },
    wishlist_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
    },
    engine_capacity: {
      type: DataTypes.STRING(50),
    },
    location: {
      type: DataTypes.STRING(255),
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "cars",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    paranoid: false,
  }
);

// Define associations
Car.belongsTo(Brand, { foreignKey: "brand_id" });
Brand.hasMany(Car, { foreignKey: "brand_id" });

export default Car;