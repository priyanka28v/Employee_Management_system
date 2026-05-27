import cron from "node-cron";
import Attendance from "../models/Attendance.js";

// EVERY DAY 12:00 AM
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("AUTO LOGOUT RUNNING");

    // TODAY DATE
    const today = new Date().toISOString().split("T")[0];

    // FIND USERS WITHOUT LOGOUT
    const records = await Attendance.find({
      date: today,

      $or: [
        { logoutTime: null },
        { logoutTime: "" },
      ],
    });

    // UPDATE
    for (const record of records) {
      record.logoutTime = "23:59";

      record.isAutoLogout = true;

      await record.save();
    }

    console.log("AUTO LOGOUT DONE");

  } catch (error) {
    console.log(error.message);
  }
});