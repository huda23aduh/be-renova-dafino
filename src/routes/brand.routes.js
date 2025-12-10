import express from "express";
// import { auth } from "../middlewares/auth.middleware.js";
import {
  createBrand,
  listBrands,
  deleteBrand
} from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", createBrand);
router.get("/", listBrands);
router.delete("/:id", deleteBrand);

export default router;
