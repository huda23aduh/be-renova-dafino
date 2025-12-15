"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("test_drives", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      car_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "cars",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      test_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      test_time: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex("test_drives", ["user_id"]);
    await queryInterface.addIndex("test_drives", ["car_id"]);
    await queryInterface.addIndex("test_drives", ["status"]);
    await queryInterface.addIndex("test_drives", ["test_date"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("test_drives");
  },
};
