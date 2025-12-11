import Car from "../models/car.model.js";
import Brand from "../models/brand.model.js";
import { Op } from "sequelize";

// Helper function to build where clause
const buildWhereClause = (query) => {
  const {
    name,
    fuel_type,
    transmission,
    min_price,
    max_price,
    min_year,
    max_year,
    search,
    is_featured,
  } = query;

  const where = {};

  // Handle brand filter
  if (name) {
    where["$Brand.name$"] = { [Op.like]: `%${name}%` };
  }

  // Handle other filters
  if (fuel_type) {
    where.fuel_type = fuel_type;
  }

  if (transmission) {
    where.transmission = transmission;
  }

  if (is_featured !== undefined) {
    where.is_featured = is_featured === "true";
  }

  // Price range filter
  if (min_price || max_price) {
    // Convert price strings to numbers for comparison
    // Remove "Rp", dots, and convert to number
    const convertPriceToNumber = (priceStr) => {
      if (!priceStr) return null;
      const cleaned = priceStr
        .replace("Rp", "")
        .replace(/\./g, "")
        .trim();
      return parseInt(cleaned) || 0;
    };

    const priceConditions = {};

    if (min_price) {
      const minPriceNum = convertPriceToNumber(min_price);
      priceConditions[Op.gte] = minPriceNum;
    }

    if (max_price) {
      const maxPriceNum = convertPriceToNumber(max_price);
      priceConditions[Op.lte] = maxPriceNum;
    }

    if (Object.keys(priceConditions).length > 0) {
      // We'll handle price filtering differently since it's stored as string
      // This is a simplified approach - you might want to store price as integer
      where.price = priceConditions;
    }
  }

  // Year range filter
  if (min_year || max_year) {
    where.year = {};
    if (min_year) {
      where.year[Op.gte] = parseInt(min_year);
    }
    if (max_year) {
      where.year[Op.lte] = parseInt(max_year);
    }
  }

  // Search across multiple fields
  if (search) {
    where[Op.or] = [
      { model_name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { "$Brand.name$": { [Op.like]: `%${search}%` } },
    ];
  }

  return where;
};

// Get all cars with filters and pagination
export const getAllCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort_by = "createdAt",
      sort_order = "DESC",
      ...filters
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = buildWhereClause(filters);

    const { count, rows } = await Car.findAndCountAll({
      where,
      include: [
        {
          model: Brand,
          attributes: ["id", "name"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order.toUpperCase()]],
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cars",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id, {
      include: [
        {
          model: Brand,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Increment views count
    car.views_count += 1;
    await car.save();

    res.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching car",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Create new car
export const createCar = async (req, res) => {
  try {
    const carData = req.body;

    // Validate required fields
    const requiredFields = [
      "model_name",
      "image",
      "price",
      "fuel_type",
      "transmission",
      "kilometers",
      "description",
      "year",
    ];

    for (const field of requiredFields) {
      if (!carData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // Handle array fields
    const arrayFields = ["gallery", "interior", "exterior", "features"];
    arrayFields.forEach((field) => {
      if (carData[field] && Array.isArray(carData[field])) {
        carData[field] = JSON.stringify(carData[field]);
      }
    });

    const car = await Car.create(carData);

    // Fetch the created car with brand info
    const createdCar = await Car.findByPk(car.id, {
      include: [
        {
          model: Brand,
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Car created successfully",
      data: createdCar,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({
      success: false,
      message: "Error creating car",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const carData = req.body;

    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Handle array fields
    const arrayFields = ["gallery", "interior", "exterior", "features"];
    arrayFields.forEach((field) => {
      if (carData[field] && Array.isArray(carData[field])) {
        carData[field] = JSON.stringify(carData[field]);
      }
    });

    await car.update(carData);

    // Fetch updated car with brand info
    const updatedCar = await Car.findByPk(id, {
      include: [
        {
          model: Brand,
          attributes: ["id", "name"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Car updated successfully",
      data: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({
      success: false,
      message: "Error updating car",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete car (soft delete)
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Soft delete by setting deleted_at
    await car.update({ deleted_at: new Date() });

    res.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting car",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Toggle wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    car.wishlist_count += 1;
    await car.save();

    res.json({
      success: true,
      message: "Added to wishlist",
      data: { wishlist_count: car.wishlist_count },
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error updating wishlist",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get featured cars
export const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: { is_featured: true },
      include: [
        {
          model: Brand,
          attributes: ["id", "name"],
        },
      ],
      limit: 6,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured cars",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get car statistics
export const getCarStats = async (req, res) => {
  try {
    const totalCars = await Car.count();
    const totalViews = await Car.sum("views_count");
    const totalWishlists = await Car.sum("wishlist_count");
    const featuredCars = await Car.count({ where: { is_featured: true } });

    // Get counts by transmission
    const manualCars = await Car.count({ where: { transmission: "Manual" } });
    const automaticCars = await Car.count({ where: { transmission: "Automatic" } });

    // Get counts by fuel type
    const petrolCars = await Car.count({ where: { fuel_type: "Bensin" } });
    const dieselCars = await Car.count({ where: { fuel_type: "Diesel" } });

    // Get top brands
    const topBrands = await Brand.findAll({
      attributes: [
        "name",
        [sequelize.fn("COUNT", sequelize.col("Cars.id")), "car_count"],
      ],
      include: [
        {
          model: Car,
          attributes: [],
          required: true,
        },
      ],
      group: ["Brand.id", "Brand.name"],
      order: [[sequelize.literal("car_count"), "DESC"]],
      limit: 5,
    });

    res.json({
      success: true,
      data: {
        total_cars: totalCars,
        total_views: totalViews || 0,
        total_wishlists: totalWishlists || 0,
        featured_cars: featuredCars,
        transmission: {
          manual: manualCars,
          automatic: automaticCars,
        },
        fuel_type: {
          petrol: petrolCars,
          diesel: dieselCars,
        },
        top_brands: topBrands,
      },
    });
  } catch (error) {
    console.error("Error fetching car stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching car statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get filter options (for dropdowns in frontend)
export const getFilterOptions = async (req, res) => {
  try {
    // Get unique brands
    const brands = await Brand.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    // Get unique fuel types
    const fuelTypes = await Car.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("fuel_type")), "fuel_type"]],
      order: [["fuel_type", "ASC"]],
    });

    // Get unique transmission types
    const transmissions = await Car.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("transmission")), "transmission"]],
      order: [["transmission", "ASC"]],
    });

    // Get year range
    const yearRange = await Car.findOne({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("year")), "min_year"],
        [sequelize.fn("MAX", sequelize.col("year")), "max_year"],
      ],
    });

    res.json({
      success: true,
      data: {
        brands: brands.map((b) => ({ id: b.id, name: b.name })),
        fuel_types: fuelTypes.map((f) => f.fuel_type).filter(Boolean),
        transmissions: transmissions.map((t) => t.transmission).filter(Boolean),
        year_range: {
          min: yearRange.dataValues.min_year,
          max: yearRange.dataValues.max_year,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching filter options",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};