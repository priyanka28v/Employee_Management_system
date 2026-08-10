import mongoose from "mongoose";

// LEAVE REQUEST SCHEMA
const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// LEAVE BALANCE SCHEMA
const leaveBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    casualLeave: {
      total: { type: Number, default: 12 },
      used: { type: Number, default: 0 },
    },
    sickLeave: {
      total: { type: Number, default: 10 },
      used: { type: Number, default: 0 },
    },
    earnedLeave: {
      total: { type: Number, default: 15 },
      used: { type: Number, default: 0 },
    },
    privilegeLeave: {
      total: { type: Number, default: 15 },
      used: { type: Number, default: 0 },
    },
    compOff: {
      total: { type: Number, default: 5 },
      used: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);
export const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);

export default Leave;