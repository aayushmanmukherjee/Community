import imagekit from "../config/imagekit.js";
import Groups from "../models/Groups.js"



export const getGroups = async (req,res) => {
    try {
        const groups = await Groups.find({ members: req.userid })
            .populate("members", "name profile_photo")
            .populate("creator", "name profile_photo");
        res.json({success:true,groups})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const getGroup = async (req,res) => {
    try {
        const {groupid} = req.params
        const group = await Groups.findById(groupid)
            .populate("members", "name profile_photo")
            .populate("creator", "name profile_photo");
        res.json({success:true,group})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const createGroup = async (req,res) => {
    try {
        const {name} = req.body
        if (!name) { return res.json({success:false, message:"Group name required"})}
        let cover_photo = ''
        if (req.file) {
            const upload = await imagekit.upload({
                file: req.file.buffer,
                fileName: `group-${Date.now()}.jpg`,
                folder: "/groups",
            });
            cover_photo = upload.url;
        }
        const group = await Groups.create({
            name,
            cover_photo,
            members:[req.userid],
            creator:req.userid,
        })
        res.json({success:true, group})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const updateGroup = async (req,res) => {
    try {
        const {groupid} = req.params
        const {name} = req.body
        const group = await Groups.findById(groupid)
        if(!group) {return res.json({success:false, message:"Group not found"})}
        if(!group.members.includes(req.userid)) {
            return res.json({success:false, message:"Not a member"})
        }
        if (name) {
            group.name = name
        }
        if (req.file) {
            const upload = await imagekit.upload({
                file: req.file.buffer,
                fileName: `group-${Date.now()}.jpg`,
                folder : '/groups'
            })
            group.cover_photo = upload.url
        }
        await group.save()
        res.json({success:true, group})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const deleteGroup = async(req,res) => {
    try {
        const {groupid} = req.params
        const group = await Groups.findById(groupid)
        if(!group) {
            return res.json({success:false, message:"Group not found"})
        }
        if(group.creator.toString() !== req.userid) {
            return res.json({success:false, message:"Only creator can delete"})
        }
        await group.deleteOne();
        res.json({success:true, message:"Group deleted"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const removeMember = async(req,res) => {
    try {
        const {memberid} = req.body
        const {groupid} = req.params
        const group = await Groups.findById(groupid)
        if(!group) {
            return res.json({success:false, message:"Group not found"})
        }
        if(group.creator.toString()!==req.userid) {
            return res.json({success:false, message:"Only creator can remove a member"})
        }
        if (memberid.toString() === group.creator.toString()) {
            return res.json({success:false, message: "Cannot remove creator of group"})
        }
        group.members = group.members.filter((i)=>i.toString()!==memberid)
        await group.save();
        res.json({success:true,group})
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const checkGroupCode = async(req,res) => {
    try {
        const {code} = req.body
       const group = await Groups.findOne({ joinLink: code })
       .populate("members", "profile_photo")

    if (!group) {
      return res.json({ success: false, message: "Invalid group code" });
    }

    return res.json({ success: true, group });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const joinGroup = async(req,res) => {
    try {
        const {code} = req.body
        const userid = req.userid
        const group = await Groups.findOne({joinLink:code})
        if(group.members.includes(userid)) {
            return res.json({success:false, message:"Already a member"})
        }
        group.members.push(userid)
        await group.save()
        return res.json({success:true, group})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


