export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("contact_messages", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    status: {
      type: Sequelize.ENUM("unread", "read", "replied"),
      defaultValue: "unread",
    },

    reply: {
      type: Sequelize.TEXT,
    },

    replied_at: {
      type: Sequelize.DATE,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("contact_messages");
}
