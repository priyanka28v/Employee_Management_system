import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    casualLeave: {
      total: {
        type: Number,
        default: 12,
      },

      used: {
        type: Number,
        default: 0,
      },
    },

    sickLeave: {
      total: {
        type: Number,
        default: 10,
      },

      used: {
        type: Number,
        default: 0,
      },
    },

    privilegeLeave: {
      total: {
        type: Number,
        default: 15,
      },

      used: {
        type: Number,
        default: 0,
      },
    },

    compOff: {
      total: {
        type: Number,
        default: 5,
      },

      used: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "LeaveBalance",
  leaveBalanceSchema
);