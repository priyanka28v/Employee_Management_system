import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/authMiddleware.js";
import {
  addSalary,
  getAdminSalaries,
  getEmployeeSalaries,
} from "../controllers/salaryController.js";
import Salary from "../models/Salary.js";

const router = express.Router();

// Admin add/update salary
router.post("/add", verifyUser, verifyAdmin, addSalary);

// Admin view all salaries
router.get("/admin", verifyUser, verifyAdmin, getAdminSalaries);

// Employee view own salary history
router.get("/my-salary", verifyUser, getEmployeeSalaries);

// Backward compatible endpoint for employee salary by ID
router.get("/employee-salary/:id", verifyUser, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const salaries = await Salary.find({ employeeId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      salaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;