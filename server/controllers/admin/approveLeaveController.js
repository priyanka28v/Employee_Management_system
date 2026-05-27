export const approveLeave = async (req, res) => {
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

    // ✅ ALREADY APPROVED

    if (leave.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Leave already approved",
      });
    }

    // ✅ FIND BALANCE

    const balance =
      await LeaveBalance.findOne({
        user: leave.user,
      });

    // ✅ CURRENT LEAVE TYPE

    const leaveData =
      balance[leave.leaveType];

    // ✅ REMAINING

    const remaining =
      leaveData.total - leaveData.used;

    // ✅ CHECK AGAIN

    if (leave.totalDays > remaining) {
      return res.status(400).json({
        success: false,
        message: "Insufficient leave balance",
      });
    }

    // ✅ UPDATE USED

    leaveData.used += leave.totalDays;

    await balance.save();

    // ✅ UPDATE STATUS

    leave.status = "approved";

    await leave.save();

    res.json({
      success: true,
      message: "Leave approved successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};