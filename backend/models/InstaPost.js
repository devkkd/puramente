const mongoose = require("mongoose");

const instaPostSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  mediaUrl: { type: String, required: true },
  icon: { type: String, enum: ["reel", "carousel"], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("InstaPost", instaPostSchema);