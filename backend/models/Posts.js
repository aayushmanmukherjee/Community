import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true } 
);

const postSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Groups", required: true },
    photos: [{ type: String }],
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    comments: [commentSchema], 
  },
  { timestamps: true } 
);

const Posts = mongoose.model("Posts", postSchema);
export default Posts;
