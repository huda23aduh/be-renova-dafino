"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "brands",
      [
        {
          id: "22222222-2222-2222-2222-222222222222",
          brand_name: "Toyota",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "33333333-3333-3333-3333-333333333333",
          brand_name: "Honda",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("brands", null, {});
  },
};
