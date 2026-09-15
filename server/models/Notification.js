import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for backwards compatibility
  title: { type: String },
  message: { type: String, required: true },
  type: { type: String, enum: ["salary", "leave", "login", "general"], default: "general" },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model("Notification", notificationSchema);
