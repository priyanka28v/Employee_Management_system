import express from "express";
import verifyUser, { verifyAdmin, verifyEmployee } from "../middleware/authMiddleware.js";
import {
  getAdminAttendance,
  getEmployeeAttendance,
  getAttendanceByEmployeeId,
  markLogout,
} from "../controllers/attendancecontroller.js";

const router = express.Router();

// Admin Attendance Route (All attendance records, pagination, search, filters)
router.get("/admin", verifyUser, verifyAdmin, getAdminAttendance);

// Employee Personal Attendance Route (Personal attendance, stats, monthly filter)
router.get('/employee', verifyUser, verifyEmployee, getEmployeeAttendance);
router.get('/employee/:id', getAttendanceByEmployeeId);
// Default route for personal attendance (fallback)
router.get('/', verifyUser, getEmployeeAttendance);

// Backward-compatible my-attendance route
router.get("/my-attendance", verifyUser, getEmployeeAttendance);

// Manual Logout Route
router.post("/logout", verifyUser, markLogout);

export default router;