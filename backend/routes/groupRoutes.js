import express from 'express'
import upload from '../middlewares/multer.js'
import auth from '../middlewares/auth.js';
import { 
  checkGroupCode, 
  createGroup, 
  deleteGroup, 
  getGroup, 
  getGroups, 
  joinGroup, 
  removeMember, 
  updateGroup 
} from '../controllers/groupController.js'

const groupRouter = express.Router()

groupRouter.get('/getgroups', auth, getGroups)
groupRouter.get('/getgroup/:groupid', getGroup)
groupRouter.post('/creategroup', auth, upload.single("cover_photo"), createGroup)
groupRouter.put('/updategroup/:groupid', auth, upload.single("cover_photo"), updateGroup)
groupRouter.delete('/deletegroup/:groupid', auth, deleteGroup)
groupRouter.delete('/removemember/:groupid', auth, removeMember)
groupRouter.post('/checkcode', checkGroupCode)
groupRouter.post('/joingroup', auth, joinGroup)

export default groupRouter;
