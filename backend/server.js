import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import groupRouter from './routes/groupRoutes.js'
import postRouter from './routes/postRouter.js'

const app = express()
await connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=> {
    res.send("server is working")
})

app.use('/api/user', userRouter)
app.use('/api/group', groupRouter)
app.use('/api/post', postRouter)



const port = process.env.PORT || 3000

app.listen(port, ()=> {
    console.log("Server is on running on port "+port)
})

export default app