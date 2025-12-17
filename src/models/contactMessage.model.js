import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("unread", "read", "replied"),
      defaultValue: "unread",
    },

    reply: {
      type: DataTypes.TEXT,
    },

    replied_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "contact_messages",
    underscored: true,
  }
);

export default ContactMessage;
