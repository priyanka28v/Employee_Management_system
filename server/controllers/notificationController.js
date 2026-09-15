import Notification from "../models/Notification.js";

// GET ADMIN NOTIFICATIONS
export const getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.user._id || req.user.id;
    const notifications = await Notification.find({
      $or: [{ admin: adminId }, { user: adminId }]
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error("Error in getAdminNotifications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET LOGGED-IN EMPLOYEE / USER NOTIFICATIONS
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notifications = await Notification.find({
      $or: [{ user: userId }, { admin: userId }]
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error("Error in getUserNotifications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// MARK SINGLE NOTIFICATION AS READ
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in markAsRead:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// MARK ALL USER NOTIFICATIONS AS READ
export const markAllUserNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await Notification.updateMany(
      { $or: [{ user: userId }, { admin: userId }], read: false },
      { read: true }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error in markAllUserNotificationsAsRead:", err);
    res.status(500).json({ message: "Server error" });
  }
};
