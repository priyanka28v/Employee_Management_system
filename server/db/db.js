import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/EMS_System");
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export default connectToDatabase;