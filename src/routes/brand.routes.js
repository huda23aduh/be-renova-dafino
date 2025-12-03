import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createBrand,
  listBrands,
  deleteBrand
} from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", auth, createBrand);
router.get("/", auth, listBrands);
router.delete("/:id", auth, deleteBrand);

export default router;
