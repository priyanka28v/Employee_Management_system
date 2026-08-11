// routes/notificationRoutes.js
import express from "express";
import verifyUser, { verifyAdmin } from "../middleware/authMiddleware.js";
import { getAdminNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/admin", verifyUser, verifyAdmin, getAdminNotifications);
router.patch("/admin/:id/read", verifyUser, verifyAdmin, markAsRead);

export default router;
