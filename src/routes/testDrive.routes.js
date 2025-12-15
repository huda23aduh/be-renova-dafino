import express from "express";
import {
  createTestDrive,
  getAllTestDrives,
  getTestDriveById,
  updateTestDriveStatus,
  deleteTestDrive,
} from "../controllers/testDrive.controller.js";

const router = express.Router();

// User
router.post("/", createTestDrive);

// Admin
router.get("/", getAllTestDrives);
router.get("/:id", getTestDriveById);
router.put("/:id/status", updateTestDriveStatus);
router.delete("/:id", deleteTestDrive);

export default router;
