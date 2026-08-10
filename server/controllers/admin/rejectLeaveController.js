import { Leave } from "../../models/Leave.js";

export const rejectLeave = async (req, res) => {
  try {

    const leave = await Leave.findById(
      req.params.id
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = "rejected";

    await leave.save();

    res.json({
      success: true,
      message: "Leave rejected",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};