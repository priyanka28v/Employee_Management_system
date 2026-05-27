import express, { Router } from 'express'
import { login,verify, registerUser} from '../controllers/authcontroller.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router=express.Router()
router.post('/login',login)
router.post("/signup", registerUser);
router.get('/verify',authMiddleware,verify)
export default router;