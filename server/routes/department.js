import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addDepartment,
  getDepartments,
  deleteDepartment,
  deactivateDepartment,
  reactivateDepartment,
  updateDepartment,
  assignEmployee,
  transferEmployee,
} from '../controllers/departmentcontroller.js';

const router = express.Router();

// Create a new department
router.post('/add', authMiddleware, addDepartment);

// Get list of departments (with optional filters)
router.get('/', authMiddleware, getDepartments);

// Soft delete (disabled) endpoint
router.delete('/:id', authMiddleware, deleteDepartment);

// Update department details
router.put('/update/:id', authMiddleware, updateDepartment);

// Deactivate / Reactivate department
router.patch('/deactivate/:id', authMiddleware, deactivateDepartment);
router.patch('/reactivate/:id', authMiddleware, reactivateDepartment);

// Assign an employee to a department (active only)
router.post('/assign/:id', authMiddleware, assignEmployee); // body: { employeeId }

// Transfer an employee from one department to another
router.post('/transfer/:id', authMiddleware, transferEmployee); // body: { employeeId, targetDeptId }

export default router;