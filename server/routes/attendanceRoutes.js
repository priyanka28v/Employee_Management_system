import express from "express";
import verifyUser, { verifyAdmin, verifyEmployee } from "../middleware/authMiddleware.js";
import {
  getAdminAttendance,
  getEmployeeAttendance,
  markLogout,
} from "../controllers/attendancecontroller.js";

const router = express.Router();

// Admin Attendance Route (All attendance records, pagination, search, filters)
router.get("/admin", verifyUser, verifyAdmin, getAdminAttendance);

// Employee Personal Attendance Route (Personal attendance, stats, monthly filter)
router.get("/employee", verifyUser, verifyEmployee, getEmployeeAttendance);

// Backward-compatible my-attendance route
router.get("/my-attendance", verifyUser, getEmployeeAttendance);

// Manual Logout Route
router.post("/logout", verifyUser, markLogout);

export default router;