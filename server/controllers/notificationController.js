import Notification from "../models/Notification.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.user.id; // assume verifyUser attaches user
    const notifications = await Notification.find({ admin: adminId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
