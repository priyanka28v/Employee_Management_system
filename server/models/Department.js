import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    dep_name: { type: String, required: true, unique: true },
    departmentCode: { type: String, required: true, unique: true },
    description: { type: String },
    employeeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;