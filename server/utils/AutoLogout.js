import Attendance from "../models/Attendance.js";

export const autoLogoutEmployees = async () => {
  try {

    // TODAY DATE
    const today = new Date()
      .toISOString()
      .split("T")[0];

    // FIND USERS WITHOUT LOGOUT
    const attendance = await Attendance.find({
      date: today,

      $or: [
        { logoutTime: null },
        { logoutTime: "" },
      ],
    });

    // CURRENT TIME
    const now = new Date();

    const logoutTime =
      `${now.getHours()}:${now.getMinutes()}`;

    // UPDATE
    for (const item of attendance) {

      item.logoutTime = logoutTime;

      item.isAutoLogout = true;

      await item.save();
    }

    console.log("✅ Auto logout completed");

  } catch (error) {

    console.log(error);

  }
};