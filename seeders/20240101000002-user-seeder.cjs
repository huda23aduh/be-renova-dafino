"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "11111111-1111-1111-1111-111111111111",
          name: "Admin User",
          email: "admin@example.com",
          password: bcrypt.hashSync("admin123", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
