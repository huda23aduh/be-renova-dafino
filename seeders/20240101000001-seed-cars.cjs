"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Starting seed...");

    // ⬇️ Load uuid dynamically (ESM import inside CJS)
    const { v4: uuidv4 } = await import("uuid");

    const { carsData } = require("../mock/carsData.cjs");

    const uniqueBrands = [...new Set(
      carsData.map(car => {
        const match = car.brand.match(/^([A-Za-z]+)/);
        return match ? match[1].toUpperCase() : "UNKNOWN";
      })
    )];

    // Insert brands with generated UUIDs
    const brandInserts = uniqueBrands.map(brandName => ({
      id: uuidv4(),
      name: brandName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("brands", brandInserts);

    // Load inserted brands
    const insertedBrands = await queryInterface.sequelize.query(
      "SELECT id, name FROM brands",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const brandIdMap = {};
    insertedBrands.forEach(b => {
      brandIdMap[b.name.toUpperCase()] = b.id;
    });

    // Insert cars
    const carInserts = carsData.map(car => {
      const brandNameMatch = car.brand.match(/^([A-Za-z]+)/);
      const brandName = brandNameMatch ? brandNameMatch[1].toUpperCase() : "UNKNOWN";

      const yearMatch = car.brand.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2015;

      return {
        id: uuidv4(),
        brand_id: brandIdMap[brandName],
        model_name: car.brand,
        image: car.image,
        price: car.price,
        fuel_type: car.fuelType,
        transmission: car.transmission,
        kilometers: car.kilometers,
        description: car.description,
        gallery: JSON.stringify(car.gallery),
        interior: JSON.stringify(car.interior),
        exterior: JSON.stringify(car.exterior),
        features: JSON.stringify(car.fasilitas || []),
        wishlist_count: car.whistlist || 0,
        views_count: car.views || 0,
        year,
        color: "Various",
        engine_capacity: "Various",
        location: "Jakarta",
        is_featured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("cars", carInserts);
    console.log("Successfully seeded cars");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cars", null, {});
    await queryInterface.bulkDelete("brands", null, {});
  },
};
