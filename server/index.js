import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";

import connectToDatabase from "./db/db.js";
import cron from "node-cron";
import { autoLogoutEmployees } from "./utils/autoLogout.js";

connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/employees", employeeRouter);
import notificationRoutes from "./routes/notificationRoutes.js";
app.use("/api/notifications", notificationRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// EVERY NIGHT 12 AM AUTO LOGOUT
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running midnight auto-logout...");
  await autoLogoutEmployees();
});