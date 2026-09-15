// routes/notificationRoutes.js
import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/authMiddleware.js";
import {
  getAdminNotifications,
  getUserNotifications,
  markAsRead,
  markAllUserNotificationsAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// General User / Employee Notifications
router.get("/user", verifyUser, getUserNotifications);
router.patch("/read-all", verifyUser, markAllUserNotificationsAsRead);
router.patch("/:id/read", verifyUser, markAsRead);

// Admin Notifications
router.get("/admin", verifyUser, verifyAdmin, getAdminNotifications);
router.patch("/admin/:id/read", verifyUser, verifyAdmin, markAsRead);

export default router;
