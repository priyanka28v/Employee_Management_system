import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Token not provided",
      });
    }

    // 2️⃣ Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format",
      });
    }

    // 3️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Find user
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        error: "Account deactivated. Please contact admin.",
      });
    }

    // 6️⃣ Attach user & continue
    req.user = user;
    next();

  } catch (error) {
    console.error("💥 VERIFY MIDDLEWARE FAILED:", error.message);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin role required.",
    });
  }
};

export const verifyEmployee = (req, res, next) => {
  if (req.user && (req.user.role === "employee" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: "Access denied.",
    });
  }
};

export default verifyUser;
