import express from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  toggleWishlist,
  getFeaturedCars,
  getCarStats,
  getFilterOptions,
} from "../controllers/car.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/featured", getFeaturedCars);
router.get("/stats", getCarStats);
router.get("/filters", getFilterOptions);
router.get("/:id", getCarById);

// Protected routes
router.post("/", createCar);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);
router.post("/:id/wishlist", toggleWishlist);

export default router;