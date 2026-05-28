const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot be longer than 60 characters'],
      trim: true
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot be longer than 160 characters'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);