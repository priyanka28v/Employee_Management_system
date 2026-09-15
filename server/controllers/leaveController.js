import { Leave, LeaveBalance } from "../models/Leave.js";
import User from "../models/User.js";
import { sendAdminNotification, sendLeaveApplicationNotification, sendLeaveStatusNotification } from "../utils/emailService.js";

// ✅ APPLY LEAVE
export const applyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    // ✅ Total Days

    const totalDays =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // ✅ Validation

    if (totalDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid date selection",
      });
    }

    // ✅ FIND USER BALANCE

    const balance = await LeaveBalance.findOne({
      user: req.user._id,
    });

    if (!balance) {
      return res.status(404).json({
        success: false,
        message: "Leave balance not found",
      });
    }

    // ✅ Skipping leave balance validation as requested
    // Directly create the leave without checking remaining balance
    const newLeave = await Leave.create({
      user: req.user._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: "pending",
    });

    // Notify admin of leave application
    await sendLeaveApplicationNotification(req.user, newLeave);

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave: newLeave,
    });
    return;

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET MY LEAVES
export const getMyLeaves = async (req, res) => {
  try {

    const leaves = await Leave.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      leaves,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET SINGLE LEAVE
export const getLeaveById = async (req, res) => {
  try {

    const leave = await Leave.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.json({
      success: true,
      leave,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ UPDATE LEAVE
export const updateLeave = async (req, res) => {
  try {

    const leave = await Leave.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // ✅ Only Pending Leave Editable
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit approved/rejected leave",
      });
    }

    const totalDays =
      Math.ceil(
        (new Date(req.body.endDate) -
          new Date(req.body.startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        leaveType: req.body.leaveType,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        totalDays,
        reason: req.body.reason,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Leave updated successfully",
      leave: updatedLeave,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ DELETE LEAVE
export const deleteLeave = async (req, res) => {
  try {

    const leave = await Leave.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // ✅ Only Pending Leave Deletable
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete approved/rejected leave",
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Leave deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    // ✅ Already approved?
    if (leave.status === "approved") {
      return res.status(400).json({ success: false, message: "Leave already approved" });
    }

    // ✅ Approve leave without balance checks
    leave.status = "approved";
    await leave.save();

    // Notify employee via email and in-app notification
    const employee = await User.findById(leave.user);
    if (employee) {
      await sendLeaveStatusNotification(employee, leave, "approved");
    }

    return res.json({ success: true, message: "Leave approved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  

// ✅ REJECT LEAVE
export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = "rejected";
    await leave.save();

    // Notify employee via email and in-app notification
    const employee = await User.findById(leave.user);
    if (employee) {
      await sendLeaveStatusNotification(employee, leave, "rejected");
    }

    res.json({
      success: true,
      message: "Leave rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};    

// ✅ GET LEAVE BALANCE
export const getLeaveBalance = async (req, res) => {
  try {
    let balance = await LeaveBalance.findOne({
      user: req.user._id,
    });

    if (!balance) {
      balance = await LeaveBalance.create({
        user: req.user._id,
        casualLeave: { total: 12, used: 0 },
        sickLeave: { total: 10, used: 0 },
        earnedLeave: { total: 15, used: 0 },
      });
    }

    res.json({
      success: true,
      balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL LEAVES FOR ADMIN (Paginated & Searchable)
export const getAdminLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "", employeeId = "" } = req.query;

  const query = {};
  if (status) {
    query.status = status.toLowerCase();
  }
  if (employeeId) {
    // We'll filter by employeeId after population
    // No direct field in Leave, so keep query empty for now
  }

  const leaves = await Leave.find(query)
    .populate({
      path: "user",
      select: "name email employeeId department position designation profileImage status",
      match: { status: "active" },
    })
    .sort({ createdAt: -1 });

  console.log('Total leaves fetched:', leaves.length);

  const filteredLeaves = leaves.filter((l) => {
    if (!l.user) return false;
    // Filter by employeeId or userId if provided (exact match, case‑insensitive)
    if (employeeId) {
      const empIdStr = (l.user.employeeId || "").toString().toLowerCase();
      const userIdStr = (l.user._id || "").toString().toLowerCase();
      const filterId = employeeId.toString().toLowerCase();
      if (empIdStr !== filterId && userIdStr !== filterId) {
        return false;
      }
    }
    if (search) {
      const term = search.toLowerCase();
      return (
        l.user.name?.toLowerCase().includes(term) ||
        l.user.email?.toLowerCase().includes(term) ||
        (l.user.employeeId || "").toString().toLowerCase().includes(term)
      );
    }
    return true;
  });
  console.log('Filtered leaves count:', filteredLeaves.length);

  const totalRecords = filteredLeaves.length;
  const totalPages = Math.ceil(totalRecords / parseInt(limit)) || 1;
  const paginatedLeaves = filteredLeaves.slice((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit));

  res.status(200).json({
    success: true,
    leaves: paginatedLeaves,
    currentPage: parseInt(page),
    totalPages,
    totalRecords,
  });
  } catch (error) {
    console.error("Error in getAdminLeaves:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin leaves",
    });
  }
};