import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import { Leave } from "../models/Leave.js";
import Salary from "../models/Salary.js";

export const getAdminSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();

    // 1. Employees Stats
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const activeEmployees = await User.countDocuments({ role: "employee", status: "active" });
    const inactiveEmployees = await User.countDocuments({ role: "employee", status: "inactive" });

    // 2. Today's Attendance Stats
    const todayAttendance = await Attendance.find({ date: today });
    const presentToday = todayAttendance.filter((a) => a.status === "Present").length;
    const lateToday = todayAttendance.filter((a) => a.status === "Late").length;
    const totalMarkedToday = todayAttendance.length;
    const absentToday = Math.max(0, activeEmployees - totalMarkedToday);

    // 3. Leave Stats
    const pendingLeaves = await Leave.countDocuments({ status: "pending" });
    const approvedLeaves = await Leave.countDocuments({ status: "approved" });
    const rejectedLeaves = await Leave.countDocuments({ status: "rejected" });

    // 4. Monthly Attendance Percentage Calculation
    const allAttendanceThisMonth = await Attendance.find({
      date: { $regex: `^${today.substring(0, 7)}` },
    });
    const presentOrLateCount = allAttendanceThisMonth.filter(
      (a) => a.status === "Present" || a.status === "Late"
    ).length;
    const totalMonthRecords = allAttendanceThisMonth.length;
    const attendancePercentage =
      totalMonthRecords > 0
        ? Math.round((presentOrLateCount / totalMonthRecords) * 100)
        : 100;

    // 5. Total Salary Payout for Current Month
    const currentMonthSalaries = await Salary.find({
      month: currentMonth,
      year: currentYear,
    });

    const totalSalaryPayout = currentMonthSalaries.reduce(
      (acc, s) => acc + (s.totalSalary || s.netSalary || 0),
      0
    );

    res.status(200).json({
      success: true,
      summary: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        presentToday,
        lateToday,
        absentToday,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        attendancePercentage,
        totalSalaryPayout,
      },
    });
  } catch (error) {
    console.error("Error in getAdminSummary:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch admin summary",
    });
  }
};
