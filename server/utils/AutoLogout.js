import Attendance from "../models/Attendance.js";

export const autoLogoutEmployees = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.find({
      date: today,
      $or: [{ logoutTime: null }, { logoutTime: "" }],
    });

    const now = new Date();
    const logoutTime = `${now.getHours()}:${now.getMinutes()}`;

    for (const item of attendance) {
      item.logoutTime = logoutTime;
      item.isAutoLogout = true;
      await item.save();
    }

    console.log("✅ Auto logout completed");
  } catch (error) {
    console.error("Auto logout error:", error.message);
  }
};
