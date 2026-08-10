import express from "express";
import verifyUser, { verifyAdmin, verifyEmployee } from "../middleware/authMiddleware.js";
import { getAdminSummary } from "../controllers/adminDashboardController.js";
import { getEmployeeSummary } from "../controllers/employeeDashboardController.js";

const router = express.Router();

// Admin Summary Endpoint
router.get("/admin-summary", verifyUser, verifyAdmin, getAdminSummary);

// Employee Summary Endpoint
router.get("/employee-summary", verifyUser, verifyEmployee, getEmployeeSummary);

export default router;
