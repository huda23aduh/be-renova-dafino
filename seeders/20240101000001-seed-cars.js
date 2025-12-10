"use strict";

const { carsData } = require("../mock/carsData");

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, create or get brands from the car data
    const brandsMap = new Map();
    const carsToInsert = [];

    // Extract unique brands and create brand entries
    for (const carData of carsData) {
      const brandNameMatch = carData.brand.match(/^([A-Za-z]+)/);
      if (brandNameMatch) {
        const brandName = brandNameMatch[1];
        if (!brandsMap.has(brandName)) {
          brandsMap.set(brandName, {
            id: Sequelize.UUIDV4(),
            brand_name: brandName,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    // Insert brands
    const brands = Array.from(brandsMap.values());
    await queryInterface.bulkInsert("brands", brands);

    // Get all inserted brands
    const insertedBrands = await queryInterface.sequelize.query(
      'SELECT id, brand_name FROM brands',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const brandIdMap = {};
    insertedBrands.forEach((brand) => {
      brandIdMap[brand.brand_name] = brand.id;
    });

    // Prepare car data with brand_id
    carsData.forEach((car, index) => {
      const brandNameMatch = car.brand.match(/^([A-Za-z]+)/);
      const brandName = brandNameMatch ? brandNameMatch[1] : "Unknown";
      const yearMatch = car.brand.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2015;

      carsToInsert.push({
        id: Sequelize.UUIDV4(),
        brand_id: brandIdMap[brandName] || null,
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
        year: year,
        color: "Various",
        engine_capacity: "Various",
        location: "Jakarta",
        is_featured: Math.random() > 0.7,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    // Insert cars
    await queryInterface.bulkInsert("cars", carsToInsert);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cars", null, {});
    await queryInterface.bulkDelete("brands", null, {});
  },
};