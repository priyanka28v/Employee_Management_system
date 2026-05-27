import express from "express";
import Salary from "../models/Salary.js";

const router = express.Router();


// ==========================================
// GET LOGGED IN EMPLOYEE SALARY
// ==========================================

router.get("/employee-salary/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    const salaries = await Salary.find({
      employeeId,
    }).sort({ createdAt: -1 });

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