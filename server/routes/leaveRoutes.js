import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/authMiddleware.js";
import {
  applyLeave,
  getMyLeaves,
  updateLeave,
  deleteLeave,
  getLeaveById,
  approveLeave,
  rejectLeave,
  getLeaveBalance,
  getAdminLeaves,
} from "../controllers/leaveController.js";

const router = express.Router();

// ================= EMPLOYEE ROUTES =================

// APPLY LEAVE
router.post("/apply", verifyUser, applyLeave);

// GET MY LEAVES
router.get("/my-leaves", verifyUser, getMyLeaves);

// GET LEAVE BALANCE
router.get("/balance", verifyUser, getLeaveBalance);

// GET SINGLE LEAVE
router.get("/:id", verifyUser, getLeaveById);

// UPDATE LEAVE
router.put("/:id", verifyUser, updateLeave);

// DELETE LEAVE
router.delete("/:id", verifyUser, deleteLeave);

// ================= ADMIN ROUTES =================

// GET ALL LEAVES (ADMIN)
router.get("/admin/all", verifyUser, verifyAdmin, getAdminLeaves);

// APPROVE LEAVE
router.put("/approve/:id", verifyUser, verifyAdmin, approveLeave);

// REJECT LEAVE
router.put("/reject/:id", verifyUser, verifyAdmin, rejectLeave);

export default router;