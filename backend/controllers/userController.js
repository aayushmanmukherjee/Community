import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
import imagekit from "../config/imagekit.js";

export const signup = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const profilePhotoFile = req.file; // multer gives this

    if (!name || !username || !password) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const exists = await Users.findOne({ username });
    if (exists) {
      return res.json({ success: false, message: "Username taken" });
    }

    let profile_photo = null;
    if (profilePhotoFile) {
      const response = await imagekit.upload({
        file: profilePhotoFile.buffer, // upload buffer
        fileName: profilePhotoFile.originalname,
        folder: "/users",
      });

      profile_photo = response.url; // store ImageKit URL in DB
    }

    const user = await Users.create({ name, username, password, profile_photo });
    const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET);

    return res.json({ success: true, user, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username, password });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET);
    return res.json({ success: true, user, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userid = req.userid; // from auth middleware
    const { name, username } = req.body;
    const profilePhotoFile = req.file;

    let updateData = { name, username };

    if (profilePhotoFile) {
      const response = await imagekit.upload({
        file: profilePhotoFile.buffer,
        fileName: profilePhotoFile.originalname,
        folder: "/users",
      });

      updateData.profile_photo = response.url;
    }

    const updatedUser = await Users.findByIdAndUpdate(userid, updateData, {
      new: true,
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userid = req.userid;
    await Users.findByIdAndDelete(userid);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const viewProfile = async (req,res) => {
    try {
        const user = await Users.findById(req.userid)
        if(!user) {
            return res.json({success:false, message:"User not found"})
        }
        res.json({success:true, user})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}