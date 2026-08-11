import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";
import { LeaveBalance } from "../models/Leave.js";
import Department from "../models/Department.js";
import { sendAdminNotification } from "../utils/emailService.js";

/* =========================
   AUTO ATTENDANCE FUNCTION
========================= */
const markAttendance = async (userId) => {
   console.log("MARK ATTENDANCE CALLED");
  const now = new Date();

  const today = now.toISOString().split("T")[0];

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const loginTime = `${hours}:${minutes}`;

  // CHECK IF ALREADY MARKED
  const alreadyMarked = await Attendance.findOne({
    employeeId: userId,
    date: today,
  });

  if (alreadyMarked) {
    return;
  }

  // LATE LOGIC
  let status = "Present";
  let lateMinutes = 0;

  if (hours > 10 || (hours === 10 && minutes > 0)) {
    status = "Late";

    lateMinutes = (hours - 10) * 60 + minutes;
  }

  // CREATE ATTENDANCE
  await Attendance.create({
    employeeId: userId,
    date: today,
    loginTime,
    status,
    lateMinutes,
  });
};

/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // CHECK USER
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Wrong password",
      });
    }

    console.log("LOGIN API HIT");
    // MARK ATTENDANCE
    await markAttendance(user._id);

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }
    );
    // Notify admin of successful login
    await sendAdminNotification('Employee Login', user);

    return res.status(200).json({
      success: true,
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        department: user.department,
        position: user.position,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* =========================
   REGISTER USER
========================= */
const registerUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const {
      name,
      email,
      phone,
      dob,
      department,
      position,
      password,
      role,
    } = req.body;

    // VALIDATIONS
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Full name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: "Email address is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email address format" });
    }

    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone number is required" });
    }

    const cleanPhone = String(phone).replace(/\s+/g, "");
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, error: "Phone number must be exactly 10 digits" });
    }

    if (!dob) {
      return res.status(400).json({ success: false, error: "Date of birth is required" });
    }

    if (!department) {
      return res.status(400).json({ success: false, error: "Department is required" });
    }

    if (!position || !position.trim()) {
      return res.status(400).json({ success: false, error: "Job position is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    // Resolve department name to ObjectId
    const deptDoc = await Department.findOne({ dep_name: department.trim() });
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      phone: cleanPhone,
      dob,
      department: deptDoc ? deptDoc._id : null,
      position: position.trim(),
      password: hashedPassword,
      role: role || "employee",
    });

    await user.save();

    // UPDATE DEPARTMENT EMPLOYEE COUNT IF DEPARTMENT EXISTS
    try {
      await Department.findOneAndUpdate(
        { dep_name: department.trim() },
        { $inc: { employeeCount: 1 } }
      );
    } catch (depErr) {
      console.log("Department count update notice:", depErr.message);
    }
    
    // CREATE DEFAULT LEAVE BALANCE
    await LeaveBalance.create({
      user: user._id,
      casualLeave: { total: 12, used: 0 },
      sickLeave: { total: 10, used: 0 },
      earnedLeave: { total: 15, used: 0 },
      privilegeLeave: { total: 15, used: 0 },
      compOff: { total: 5, used: 0 },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        department: user.department,
        position: user.position,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("🔥 ERROR:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Server error during registration",
    });
  }
};

/* =========================
   VERIFY USER
========================= */
const verify = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export { login, registerUser, verify };