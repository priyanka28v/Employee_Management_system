import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";
import bcrypt from "bcrypt";
import connectToDatabase from "./db/db.js";

const userRegister = async () => {
  await connectToDatabase();
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashPassword = await bcrypt.hash("admin123", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      phone: "0000000000",
      dob: "1990-01-01",
      department: "Management",
      position: "Administrator",
      password: hashPassword,
      role: "admin",
      status: "active",
    });
    await newUser.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

userRegister();