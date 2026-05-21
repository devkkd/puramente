const InstaPost = require("../models/InstaPost");
const { uploadToCloudflare } = require("../utils/upload");

exports.getInstaPosts = async (req, res) => {
  try {
    const posts = await InstaPost.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.addInstaPost = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No media file uploaded" });
    
    const mediaUrl = await uploadToCloudflare(req.file);
    const { icon, type } = req.body;

    const newPost = await InstaPost.create({ type, mediaUrl, icon });
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Upload failed" });
  }
};

exports.deleteInstaPost = async (req, res) => {
  try {
    await InstaPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Deletion failed" });
  }
};