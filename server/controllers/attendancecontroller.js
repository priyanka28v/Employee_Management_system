import express from "express";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/* =========================
   MY ATTENDANCE
========================= */

router.get("/my-attendance", async (req, res) => {
  try {

    // TOKEN
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // BEARER TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // FIND ATTENDANCE
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