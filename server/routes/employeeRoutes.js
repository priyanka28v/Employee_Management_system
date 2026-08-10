import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/authMiddleware.js";
import {
  getEmployees,
  addEmployee,
  getEmployeeById,
  updateEmployee,
  toggleEmployeeStatus,
} from "../controllers/employeeController.js";

const router = express.Router();

// GET ALL EMPLOYEES (ADMIN)
router.get("/", verifyUser, verifyAdmin, getEmployees);

// ADD NEW EMPLOYEE (ADMIN)
router.post("/add", verifyUser, verifyAdmin, addEmployee);

// GET SINGLE EMPLOYEE DETAILS
router.get("/:id", verifyUser, getEmployeeById);

// UPDATE EMPLOYEE
router.put("/:id", verifyUser, verifyAdmin, updateEmployee);

// TOGGLE STATUS (ACTIVATED/DEACTIVATED)
router.patch("/:id/status", verifyUser, verifyAdmin, toggleEmployeeStatus);

export default router;
