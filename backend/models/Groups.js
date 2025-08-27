import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'

const groupSchema = new mongoose.Schema(
    {
        name: {type:String, required:true},
        cover_photo: {type: String, default:""},
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        members: [{type:mongoose.Schema.Types.ObjectId,ref:"Users"}],
        joinLink: {type: String, unique:true, default: ()=> uuidv4(),},
    },
    {timestamps:true}
)

const Groups = mongoose.model("Groups", groupSchema)

export default Groups