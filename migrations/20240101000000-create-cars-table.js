"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cars", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      brand_id: {
        type: Sequelize.UUID,
        references: {
          model: "brands",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      model_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      fuel_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      transmission: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      kilometers: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gallery: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      interior: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      exterior: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      features: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      wishlist_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      views_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(50),
      },
      engine_capacity: {
        type: Sequelize.STRING(50),
      },
      location: {
        type: Sequelize.STRING(255),
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("cars", ["brand_id"]);
    await queryInterface.addIndex("cars", ["model_name"]);
    await queryInterface.addIndex("cars", ["fuel_type"]);
    await queryInterface.addIndex("cars", ["transmission"]);
    await queryInterface.addIndex("cars", ["year"]);
    await queryInterface.addIndex("cars", ["price"]);
    await queryInterface.addIndex("cars", ["is_featured"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cars");
  },
};