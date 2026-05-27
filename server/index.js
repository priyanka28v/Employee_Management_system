import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";

import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";

import connectToDatabase from "./db/db.js";

import cron from "node-cron";

import {
  autoLogoutEmployees,
} from "./utils/autoLogout.js";

connectToDatabase();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/department", departmentRouter);

app.use("/api/leave", leaveRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/salary", salaryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});


// EVERY NIGHT 12 AM

cron.schedule("0 0 * * *", async () => {

  console.log("⏰ Auto Logout Running");

  await autoLogoutEmployees();

});