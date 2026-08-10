import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// GET ADMIN ATTENDANCE (Paginated, Searchable, Filterable)
export const getAdminAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", date = "", month = "", status = "" } = req.query;

    const query = {};

    if (date) {
      query.date = date;
    } else if (month) {
      query.date = { $regex: `^${month}` };
    }

    if (status) {
      query.status = status;
    }

    // If search term is provided, filter employee IDs first
    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { employeeId: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      const userIds = matchingUsers.map((u) => u._id);
      query.employeeId = { $in: userIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await Attendance.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit)) || 1;

    const records = await Attendance.find(query)
      .populate("employeeId", "name email employeeId department position designation profileImage")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      attendance: records,
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    console.error("Error in getAdminAttendance:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch attendance records",
    });
  }
};

// GET EMPLOYEE PERSONAL ATTENDANCE (With Monthly/Weekly Filters & Stats)
export const getEmployeeAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month = "", page = 1, limit = 15 } = req.query;

    const query = { employeeId: userId };
    if (month) {
      query.date = { $regex: `^${month}` };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await Attendance.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit)) || 1;

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Stats calculation across user's filtered records
    const allUserAttendance = await Attendance.find(query);
    const totalWorkingDays = allUserAttendance.length;
    const presentDays = allUserAttendance.filter((a) => a.status === "Present").length;
    const lateDays = allUserAttendance.filter((a) => a.status === "Late").length;
    const absentDays = allUserAttendance.filter((a) => a.status === "Absent").length;
    const attendancePercentage =
      totalWorkingDays > 0
        ? Math.round(((presentDays + lateDays) / totalWorkingDays) * 100)
        : 100;

    res.status(200).json({
      success: true,
      attendance,
      stats: {
        totalWorkingDays,
        presentDays,
        lateDays,
        absentDays,
        attendancePercentage,
      },
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    console.error("Error in getEmployeeAttendance:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch attendance history",
    });
  }
};

// MARK LOGOUT (Manual)
export const markLogout = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const logoutTime = `${now.getHours()}:${now.getMinutes()}`;

    const record = await Attendance.findOne({
      employeeId: userId,
      date: today,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: "No attendance record found for today.",
      });
    }

    record.logoutTime = logoutTime;
    await record.save();

    res.status(200).json({
      success: true,
      message: "Logout time recorded successfully",
      attendance: record,
    });
  } catch (error) {
    console.error("Error in markLogout:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to mark logout",
    });
  }
};