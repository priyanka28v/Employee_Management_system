import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addDepartment ,getDepartments,deleteDepartment} from '../controllers/departmentcontroller.js'

const router=express.Router()
router.post('/add',authMiddleware,addDepartment)
router.get('/',authMiddleware,getDepartments)
router.delete('/:id', authMiddleware, deleteDepartment)

export default router