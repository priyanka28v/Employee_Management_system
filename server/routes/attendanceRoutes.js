import express from "express";
import Attendance from "../models/Attendance.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =========================
   MARK ATTENDANCE
========================= */

router.post("/mark", async (req, res) => {
  try {
    const { employeeId } = req.body;

    const now = new Date();

    const today = now.toISOString().split("T")[0];

    const hours = now.getHours();
    const minutes = now.getMinutes();

    const loginTime = `${hours}:${minutes}`;

    // CHECK ALREADY EXISTS
    const exists = await Attendance.findOne({
      employeeId,
      date: today,
    });

    // IF ALREADY MARKED
    if (exists) {
      return res.status(200).json({
        success: true,
        message: "Attendance already marked",
        attendance: exists,
      });
    }

    // LATE LOGIC
    let status = "Present";
    let lateMinutes = 0;

    if (hours > 10 || (hours === 10 && minutes > 0)) {
      status = "Late";

      lateMinutes = (hours - 10) * 60 + minutes;
    }

    // CREATE ATTENDANCE
    const attendance = await Attendance.create({
      employeeId,
      date: today,
      loginTime,
      status,
      lateMinutes,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   GET EMPLOYEE ATTENDANCE
========================= */

router.get("/employee/:id", async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employeeId: req.params.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      attendance,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/my-attendance", async (req, res) => {
  try {

    // TOKEN SE USER NIKALO
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // USER ATTENDANCE
    const attendance = await Attendance.find({
      employeeId: decoded._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      attendance,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

export default router;