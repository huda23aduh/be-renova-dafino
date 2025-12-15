import TestDrive from "../models/testDrive.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";

// CREATE
export const createTestDrive = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      testDate,
      testTime,
      message,
      carId,
      userId
    } = req.body;

    if (!fullName || !phone || !email || !testDate || !testTime || !carId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const testDrive = await TestDrive.create({
      full_name: fullName,
      phone,
      email,
      test_date: testDate,
      test_time: testTime,
      message,
      car_id: carId,
      user_id: userId, // JWT ready
    });

    res.status(201).json({
      success: true,
      message: "Test drive registered successfully",
      data: testDrive,
    });
  } catch (error) {
    console.error("Create test drive error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create test drive",
    });
  }
};

// GET ALL (Admin)
export const getAllTestDrives = async (req, res) => {
  try {
    const data = await TestDrive.findAll({
      include: [
        { model: Car },
        { model: User, attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

// GET BY ID
export const getTestDriveById = async (req, res) => {
  try {
    const data = await TestDrive.findByPk(req.params.id, {
      include: [Car, User],
    });

    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// UPDATE STATUS
export const updateTestDriveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const testDrive = await TestDrive.findByPk(req.params.id);
    if (!testDrive) {
      return res.status(404).json({ success: false });
    }

    await testDrive.update({ status });

    res.json({
      success: true,
      message: "Status updated",
      data: testDrive,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// DELETE
export const deleteTestDrive = async (req, res) => {
  try {
    const testDrive = await TestDrive.findByPk(req.params.id);
    if (!testDrive) {
      return res.status(404).json({ success: false });
    }

    await testDrive.destroy();

    res.json({
      success: true,
      message: "Test drive deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
