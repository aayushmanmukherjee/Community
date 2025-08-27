import express from 'express'
import upload from '../middlewares/multer.js'
import auth from '../middlewares/auth.js';
import { createComment, createPost, getComments, getPosts, like } from '../controllers/postController.js';

const postRouter = express.Router()

postRouter.get('/getposts/:groupid', getPosts)
postRouter.post('/createpost/:groupid', auth, upload.array("photos",10),createPost)
postRouter.post('/like', auth, like)
postRouter.get('/getcomments/:postid', getComments)
postRouter.post('/createcomment', auth, createComment)

export default postRouter;