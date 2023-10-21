import express from 'express'
import { forgotPasswordController, loginController, registerController, testController } from './../controller/authController.js';
import { isAdmin, requireSingnIn } from './../middleware/authMiddleware.js';



const router = express.Router()

router.post('/register',registerController)
router.post('/login', loginController)
router.post("/forgot-password", forgotPasswordController);
router.get('/test',requireSingnIn, isAdmin, testController)
router.get('/user-auth', requireSingnIn, (req,res)=>{
    res.status(200).send({ok:true})
})
router.get('/admin-auth', requireSingnIn,isAdmin, (req,res)=>{
    res.status(200).send({ok:true})
})

export default router