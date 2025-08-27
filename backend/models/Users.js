import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {type:String, required:true},
        username: {type:String, required:true, unique:true},
        password: {type:String, required:true},
        profile_photo: {type:String, default:""},
        groups: [{type: mongoose.Schema.Types.ObjectId, ref:"Groups"}],
    },
    {timestamps:true}
)

const Users = mongoose.model("Users", userSchema)

export default Users;