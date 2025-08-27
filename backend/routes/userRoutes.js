import express from 'express'
import upload from '../middlewares/multer.js'
import auth from '../middlewares/auth.js';
import { deleteUser, login, signup, updateUser, viewProfile } from '../controllers/userController.js'


const userRouter = express.Router()

userRouter.post('/signup', upload.single("profile_photo"), signup)
userRouter.post('/login', login)
userRouter.put('/updateuser', auth,upload.single("profile_photo"), updateUser)
userRouter.delete('/deleteuser', auth, deleteUser)
userRouter.get('/getprofile', auth, viewProfile)

export default userRouter;