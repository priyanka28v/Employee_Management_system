import Salary from "../models/Salary.js";
import Attendance from "../models/Attendance.js";

export const generateSalary = async (
  req,
  res
) => {
  try {

    const {
      employeeId,
      month,
      year,
      basicSalary,
      bonus,
    } = req.body;

    // GET ATTENDANCE

    const attendance = await Attendance.find({
      userId: employeeId,
    });

    // LATE COUNT

    const lateCount = attendance.filter(
      (a) => a.status === "Late"
    ).length;

    // ABSENT COUNT

    const absentCount = attendance.filter(
      (a) => a.status === "Absent"
    ).length;

    // DEDUCTIONS

    const lateDeductions =
      lateCount * 100;

    const absentDeductions =
      absentCount * 500;

    const deductions =
      lateDeductions +
      absentDeductions;

    // ATTENDANCE %

    const presentDays = attendance.filter(
      (a) =>
        a.status === "Present" ||
        a.status === "Late"
    ).length;

    const totalDays = attendance.length;

    const attendancePercentage =
      totalDays > 0
        ? (
            (presentDays / totalDays) *
            100
          ).toFixed(2)
        : 0;

    // FINAL SALARY

    const totalSalary =
      basicSalary +
      bonus -
      deductions;

    // SAVE

    const salary = await Salary.create({
      employeeId,
      month,
      year,
      basicSalary,
      bonus,
      deductions,
      lateDeductions,
      absentDeductions,
      attendancePercentage,
      totalSalary,
    });

    res.status(201).json({
      success: true,
      salary,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};