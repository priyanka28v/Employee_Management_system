import User from "../models/User.js";
import Department from "../models/Department.js";

/**
 * Recalculate employeeCount from active employees assigned to each department.
 * When depName is provided, only that department is updated.
 */
export const syncDepartmentEmployeeCounts = async (depName = null) => {
  const departments = depName
    ? await Department.find({ dep_name: depName })
    : await Department.find();

  for (const department of departments) {
    const count = await User.countDocuments({
      role: "employee",
      department: department.dep_name,
      status: "active",
    });

    department.employeeCount = count;
    await department.save();
  }
};

/** Normalize department name to match Department.dep_name convention */
export const normalizeDepartmentName = (name) => {
  if (!name || typeof name !== "string") return "";
  return name.trim().toUpperCase();
};
