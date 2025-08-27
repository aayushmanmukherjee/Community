import Posts from "../models/Posts.js"
import imagekit from "../config/imagekit.js";


export const getPosts = async(req,res) => {
    try {
        const {groupid} = req.params
        const posts = await Posts.find({group:groupid})
        .populate("createdBy", "name username profile_photo") // only get name & profile_photo
      // .populate("comments.user", "name profile_photo") // for each comment's user
      .sort({ createdAt: -1 });
        res.json({success:true, posts})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const {groupid} = req.params;

    if (!content && !req.files) {
      return res.json({ success: false, message: "Post must have text or images" });
    }

    let photoUrls = [];

    if (req.files && req.files.length > 0) {
      // Upload each file to imagekit
      for (let file of req.files) {
        const upload = await imagekit.upload({
          file: file.buffer, // multer provides buffer
          fileName: `post-${Date.now()}-${file.originalname}`,
          folder: "/posts"
        });
        photoUrls.push(upload.url);
      }
    }

    const newPost = await Posts.create({
      content,
      photos: photoUrls,
      createdBy: req.userid,   // comes from auth middleware
      group: groupid,
      likes: [],
      comments: []
    });

    res.json({ success: true, post: newPost });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const like = async (req, res) => {
  try {
    const { postid } = req.body;
    const post = await Posts.findById(postid);

    if (!post) return res.json({ success: false, message: "Post not found" });

    if (post.likes.some(user => user.toString() === req.userid)) {
      // Unlike
      post.likes = post.likes.filter(user => user.toString() !== req.userid);
    } else {
      // Like
      post.likes.push(req.userid);
    }

    await post.save();

    // Populate AFTER save to ensure all likes are full user objects
    await post.populate("likes", "name username profile_photo _id");

    return res.json({ success: true, likes: post.likes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getComments = async(req,res) => {
    try {
        const {postid} = req.params
        const post = await Posts.findById(postid)
        .populate(
      "comments.user", "name profile_photo username");
    res.json({ success: true, comments: post.comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postid } = req.body; 
    const user = req.userid;
    if (!text) {
      return res.json({ success: false, message: "Enter comment" });
    }
    const post = await Posts.findById(postid);
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }
    const comment = { user, text };
    post.comments.push(comment);
    await post.save();
    return res.json({ success: true, comment: post.comments[post.comments.length - 1] });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};