import LeaveBalance from '../models/Leave.js';
import Salary from '../models/Salary.js';
import User from '../models/User.js';

// Update leave allocation totals for an employee (admin only)
export const updateLeaveAllocation = async (req, res) => {
  try {
    const { id } = req.params; // employee user id
    const { casualLeave, sickLeave, earnedLeave, privilegeLeave, compOff } = req.body;

    // Ensure values are non-negative numbers (if provided)
    const validate = (val) => (val === undefined ? undefined : Number(val));
    const totals = {
      casualLeave: validate(casualLeave),
      sickLeave: validate(sickLeave),
      earnedLeave: validate(earnedLeave),
      privilegeLeave: validate(privilegeLeave),
      compOff: validate(compOff),
    };
    for (const [key, value] of Object.entries(totals)) {
      if (value !== undefined && (isNaN(value) || value < 0)) {
        return res.status(400).json({ success: false, error: `${key} must be a non‑negative number` });
      }
    }

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    let balance = await LeaveBalance.findOne({ user: id });
    if (!balance) {
      // create default balance first then update
      balance = await LeaveBalance.create({ user: id });
    }

    // Update only totals, keep used unchanged
    if (totals.casualLeave !== undefined) balance.casualLeave.total = totals.casualLeave;
    if (totals.sickLeave !== undefined) balance.sickLeave.total = totals.sickLeave;
    if (totals.earnedLeave !== undefined) balance.earnedLeave.total = totals.earnedLeave;
    if (totals.privilegeLeave !== undefined) balance.privilegeLeave.total = totals.privilegeLeave;
    if (totals.compOff !== undefined) balance.compOff.total = totals.compOff;

    await balance.save();
    return res.status(200).json({ success: true, leaveBalance: balance });
  } catch (error) {
    console.error('Error in updateLeaveAllocation:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update leave allocation' });
  }
};

// Upsert salary record for an employee (admin only)
export const upsertSalary = async (req, res) => {
  try {
    const { id } = req.params; // employee user id
    const {
      basicSalary,
      allowances = 0,
      deductions = 0,
      bonus = 0,
      month,
      year,
      paymentStatus = 'Paid',
    } = req.body;

    if (!basicSalary || !month || !year) {
      return res.status(400).json({ success: false, error: 'basicSalary, month and year are required' });
    }
    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const basic = Number(basicSalary);
    const allow = Number(allowances);
    const ded = Number(deductions);
    const bon = Number(bonus);
    if ([basic, allow, ded, bon].some((n) => isNaN(n) || n < 0)) {
      return res.status(400).json({ success: false, error: 'Salary components must be non‑negative numbers' });
    }
    const netSalary = basic + allow + bon - ded;

    let salary = await Salary.findOne({ employeeId: id, month, year: Number(year) });
    if (salary) {
      salary.basicSalary = basic;
      salary.allowances = allow;
      salary.deductions = ded;
      salary.bonus = bon;
      salary.totalSalary = netSalary;
      salary.netSalary = netSalary;
      salary.status = paymentStatus;
      await salary.save();
    } else {
      salary = await Salary.create({
        employeeId: id,
        basicSalary: basic,
        allowances: allow,
        deductions: ded,
        bonus: bon,
        totalSalary: netSalary,
        netSalary,
        month,
        year: Number(year),
        status: paymentStatus,
      });
    }
    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error('Error in upsertSalary:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to upsert salary' });
  }
};

// Get leave allocation for an employee (admin only)
export const getLeaveAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await LeaveBalance.findOne({ user: id });
    if (!balance) {
      return res.status(404).json({ success: false, error: 'Leave allocation not found' });
    }
    return res.status(200).json({ success: true, leaveBalance: balance });
  } catch (error) {
    console.error('Error in getLeaveAllocation:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get leave allocation' });
  }
};

// Get salary record for an employee (admin only)
export const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findOne({ employeeId: id });
    if (!salary) {
      return res.status(404).json({ success: false, error: 'Salary record not found' });
    }
    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error('Error in getSalary:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to get salary' });
  }
};
