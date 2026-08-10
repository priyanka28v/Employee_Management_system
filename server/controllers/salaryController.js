import Salary from "../models/Salary.js";
import User from "../models/User.js";

// ADD OR UPDATE SALARY (Admin)
export const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      allowances = 0,
      deductions = 0,
      bonus = 0,
      month,
      year,
      paymentStatus = "Paid",
    } = req.body;

    if (!employeeId || !basicSalary || !month || !year) {
      return res.status(400).json({
        success: false,
        error: "Employee, Basic Salary, Month, and Year are required.",
      });
    }

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // Backend Net Salary Calculation: Net = Basic + Allowances + Bonus - Deductions
    const basic = Number(basicSalary);
    const allow = Number(allowances);
    const bon = Number(bonus);
    const ded = Number(deductions);

    const netSalary = basic + allow + bon - ded;

    // Check if salary record already exists for this employee for the given month/year
    let salaryRecord = await Salary.findOne({
      employeeId,
      month,
      year: Number(year),
    });

    if (salaryRecord) {
      salaryRecord.basicSalary = basic;
      salaryRecord.allowances = allow;
      salaryRecord.bonus = bon;
      salaryRecord.deductions = ded;
      salaryRecord.totalSalary = netSalary;
      salaryRecord.netSalary = netSalary;
      salaryRecord.status = paymentStatus;
      await salaryRecord.save();
    } else {
      salaryRecord = await Salary.create({
        employeeId,
        basicSalary: basic,
        allowances: allow,
        bonus: bon,
        deductions: ded,
        totalSalary: netSalary,
        netSalary,
        month,
        year: Number(year),
        status: paymentStatus,
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary record saved successfully",
      salary: salaryRecord,
    });
  } catch (error) {
    console.error("Error in addSalary:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to save salary record",
    });
  }
};

// GET ADMIN SALARIES (Searchable, Filterable, Paginated)
export const getAdminSalaries = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", month = "", year = "" } = req.query;

    const query = {};
    if (month) query.month = month;
    if (year) query.year = Number(year);

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { employeeId: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      query.employeeId = { $in: matchingUsers.map((u) => u._id) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await Salary.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit)) || 1;

    const salaries = await Salary.find(query)
      .populate("employeeId", "name email employeeId department position designation")
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      salaries,
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    console.error("Error in getAdminSalaries:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch salary records",
    });
  }
};

// GET EMPLOYEE PERSONAL SALARIES
export const getEmployeeSalaries = async (req, res) => {
  try {
    const userId = req.user._id;

    const salaries = await Salary.find({ employeeId: userId })
      .populate("employeeId", "name email employeeId department position designation")
      .sort({ year: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      salaries,
    });
  } catch (error) {
    console.error("Error in getEmployeeSalaries:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch personal salary history",
    });
  }
};
