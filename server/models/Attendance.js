import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    loginTime: {
      type: String,
    },

    logoutTime: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Present", "Late","Absent"],
      default: "Present",
    },
    isAutoLogout: {
  type: Boolean,
  default: false,
},

    lateMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);

export default Attendance;