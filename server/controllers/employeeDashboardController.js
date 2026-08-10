import Attendance from "../models/Attendance.js";
import { Leave, LeaveBalance } from "../models/Leave.js";
import Salary from "../models/Salary.js";

export const getEmployeeSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0];
    const monthPrefix = today.substring(0, 7);

    // 1. Today's Attendance
    const todayAttendance = await Attendance.findOne({
      employeeId: userId,
      date: today,
    });

    // 2. Monthly Attendance Stats
    const monthlyAttendance = await Attendance.find({
      employeeId: userId,
      date: { $regex: `^${monthPrefix}` },
    });

    const totalWorkingDays = monthlyAttendance.length;
    const presentDays = monthlyAttendance.filter((a) => a.status === "Present").length;
    const lateDays = monthlyAttendance.filter((a) => a.status === "Late").length;
    const absentDays = monthlyAttendance.filter((a) => a.status === "Absent").length;

    const attendedDays = presentDays + lateDays;
    const attendancePercentage =
      totalWorkingDays > 0
        ? Math.round((attendedDays / totalWorkingDays) * 100)
        : 100;

    // 3. Leave Balance & Pending Leaves
    let balance = await LeaveBalance.findOne({ user: userId });
    if (!balance) {
      balance = await LeaveBalance.create({
        user: userId,
        casualLeave: { total: 12, used: 0 },
        sickLeave: { total: 10, used: 0 },
        earnedLeave: { total: 15, used: 0 },
      });
    }

    const pendingLeaves = await Leave.countDocuments({
      user: userId,
      status: "pending",
    });

    // 4. Recent Salary
    const recentSalary = await Salary.findOne({ employeeId: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      summary: {
        todayAttendance: todayAttendance || {
          status: "Not Marked",
          loginTime: "-",
          logoutTime: "-",
        },
        stats: {
          totalWorkingDays,
          presentDays,
          lateDays,
          absentDays,
          attendancePercentage,
        },
        leaveBalance: balance,
        pendingLeaves,
        recentSalary: recentSalary || null,
      },
    });
  } catch (error) {
    console.error("Error in getEmployeeSummary:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch employee summary",
    });
  }
};
