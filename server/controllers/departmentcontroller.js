import Department from "../models/Department.js";
import User from "../models/User.js";

const getDepartments = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ dep_name: regex }, { departmentCode: regex }];
    }
    if (status) {
      filter.status = status.toLowerCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await Department.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / parseInt(limit)) || 1;

    const departments = await Department.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      departments,
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get department server error" });
  }
};

// Add a new department
const addDepartment = async (req, res) => {
  try {
    let { dep_name, departmentCode, description, employeeCount } = req.body;
    if (!dep_name || !departmentCode) {
      return res.status(400).json({ success: false, error: "dep_name and departmentCode are required" });
    }
    dep_name = dep_name.trim().toUpperCase();
    departmentCode = departmentCode.trim().toUpperCase();
    const newDep = new Department({
      dep_name,
      departmentCode,
      description,
      employeeCount: employeeCount || 0,
      status: "active",
    });
    await newDep.save();
    return res.status(201).json({ success: true, department: newDep });
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in add department" });
  }
};

// Prevent hard delete; use deactivate instead
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) return res.status(404).json({ success: false, error: "Department not found" });
    // Check if any active employees are assigned (employeeCount > 0)
    if (department.employeeCount && department.employeeCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete department with active employees. Deactivate or reassign them first.",
      });
    }
    await Department.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

// Deactivate department
const deactivateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, { status: "inactive" }, { new: true });
    if (!department) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Reactivate department
const reactivateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, { status: "active" }, { new: true });
    if (!department) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update department details
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, departmentCode, description, head, status, employeeCount } = req.body;
    const update = {};
    if (dep_name) update.dep_name = dep_name.trim().toUpperCase();
    if (departmentCode) update.departmentCode = departmentCode.trim().toUpperCase();
    if (description !== undefined) update.description = description;
    if (head) update.head = head;
    if (employeeCount !== undefined) update.employeeCount = employeeCount;
    const department = await Department.findByIdAndUpdate(id, update, { new: true });
    if (!department) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Assign employee to department (only active)
const assignEmployee = async (req, res) => {
  try {
    const { id } = req.params; // department id
    const { employeeId } = req.body;
    const department = await Department.findById(id);
    if (!department) return res.status(404).json({ success: false, error: "Department not found" });
    if (department.status !== "active") {
      return res.status(400).json({ success: false, error: "Cannot assign to an inactive department" });
    }
    const user = await User.findByIdAndUpdate(employeeId, { department: department._id }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: "Employee not found" });
    await Department.findByIdAndUpdate(id, { $inc: { employeeCount: 1 } });
    return res.status(200).json({ success: true, employee: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Transfer employee between departments
const transferEmployee = async (req, res) => {
  try {
    const { id } = req.params; // source department id
    const { employeeId, targetDeptId } = req.body;
    const source = await Department.findById(id);
    const target = await Department.findById(targetDeptId);
    if (!source || !target) {
      return res.status(404).json({ success: false, error: "Source or target department not found" });
    }
    if (target.status !== "active") {
      return res.status(400).json({ success: false, error: "Target department is inactive" });
    }
    const user = await User.findByIdAndUpdate(employeeId, { department: target._id }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: "Employee not found" });
    await Department.findByIdAndUpdate(source._id, { $inc: { employeeCount: -1 } });
    await Department.findByIdAndUpdate(target._id, { $inc: { employeeCount: 1 } });
    return res.status(200).json({ success: true, employee: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export {
  addDepartment,
  getDepartments,
  deleteDepartment,
  deactivateDepartment,
  reactivateDepartment,
  updateDepartment,
  assignEmployee,
  transferEmployee,
};
