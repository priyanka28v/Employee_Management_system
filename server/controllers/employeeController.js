import User from "../models/User.js";
import bcrypt from "bcrypt";
import { LeaveBalance, Leave } from "../models/Leave.js";
import Attendance from "../models/Attendance.js";
import Salary from "../models/Salary.js";

// Helper to generate unique employeeId
const generateEmployeeId = async () => {
  const count = await User.countDocuments();
  const num = (count + 1).toString().padStart(4, "0");
  return `EMP-${num}`;
};

// GET EMPLOYEES (Admin Paginated, Filtered & Searched)
export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", department = "", status = "" } = req.query;

    const query = { role: "employee" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await User.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit)) || 1;

    const employees = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      employees,
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    console.error("Error in getEmployees:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch employees",
    });
  }
};

// ADD EMPLOYEE (Admin)
export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      dob,
      department,
      position,
      designation,
      joiningDate,
      address,
      role = "employee",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, Email, and Password are required fields.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Employee with this email already exists.",
      });
    }

    const empId = await generateEmployeeId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? String(phone).trim() : "",
      dob: dob || "",
      department: department ? department.trim() : "",
      position: position ? position.trim() : designation ? designation.trim() : "",
      designation: designation ? designation.trim() : position ? position.trim() : "",
      joiningDate: joiningDate || new Date().toISOString().split("T")[0],
      address: address || "",
      employeeId: empId,
      role,
      status: "active",
    });

    await user.save();

    // Create default leave balance
    await LeaveBalance.create({
      user: user._id,
      casualLeave: { total: 12, used: 0 },
      sickLeave: { total: 10, used: 0 },
      earnedLeave: { total: 15, used: 0 },
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: {
        _id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        department: user.department,
        position: user.position,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create employee",
    });
  }
};

// GET SINGLE EMPLOYEE DETAILS
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findById(id).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // Attendance Summary
    const attendanceRecords = await Attendance.find({ employeeId: id });
    const presentCount = attendanceRecords.filter((a) => a.status === "Present").length;
    const lateCount = attendanceRecords.filter((a) => a.status === "Late").length;
    const absentCount = attendanceRecords.filter((a) => a.status === "Absent").length;
    const totalDays = attendanceRecords.length;
    const attendancePercentage = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 100;

    // Leave Summary
    const leaveBalance = await LeaveBalance.findOne({ user: id });
    const pendingLeaves = await Leave.countDocuments({ user: id, status: "pending" });

    // Salary Summary
    const salaryHistory = await Salary.find({ employeeId: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      employee,
      attendanceSummary: {
        presentCount,
        lateCount,
        absentCount,
        totalDays,
        attendancePercentage,
      },
      leaveSummary: {
        leaveBalance,
        pendingLeaves,
      },
      salarySummary: {
        salaryHistory,
        currentSalary: salaryHistory[0] || null,
      },
    });
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch employee details",
    });
  }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.password; // Do not update password through this route

    const updatedEmployee = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update employee",
    });
  }
};

// TOGGLE STATUS (ACTIVATE / DEACTIVATE)
export const toggleEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const employee = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Employee ${status === "active" ? "activated" : "deactivated"} successfully`,
      employee,
    });
  } catch (error) {
    console.error("Error in toggleEmployeeStatus:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update status",
    });
  }
};
