import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";
import LeaveBalance from "../models/Leave.js";

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

    // CHECK USER
    const user = await User.findOne({ email });

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

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = new User({
      name,
      email,
      phone,
      dob,
      department,
      position,
      password: hashedPassword,
      role: role || "employee",
    });

    await user.save();
    
// CREATE DEFAULT LEAVE BALANCE

await LeaveBalance.create({
  employeeId: user._id,

  casualLeave: 12,

  sickLeave: 10,

  earnedLeave: 15,
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

    return res.status(500).json({
      success: false,
      error: "Server error",
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