const Blog = require("../models/Blog");
const { uploadToCloudflare } = require("../utils/upload");

// Utility to create a URL-friendly slug
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, metaTitle, metaDescription } = req.body;
    if (!req.file) return res.status(400).json({ error: "Blog image is required." });

    const imageUrl = await uploadToCloudflare(req.file);
    
    // Ensure unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBlog = new Blog({ title, slug, excerpt, content, imageUrl, metaTitle, metaDescription });
    await newBlog.save();

    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const recentBlogs = await Blog.find({ _id: { $ne: blog._id } })
                                  .sort({ createdAt: -1 })
                                  .limit(2);

    res.status(200).json({ success: true, data: { blog, recentBlogs } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- NEW: Get Blog By ID (For Admin Edit Page) ---
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- NEW: Update Blog ---
exports.updateBlog = async (req, res) => {
  try {
    const { title, excerpt, content, metaTitle, metaDescription } = req.body;
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const updates = { title, excerpt, content, metaTitle, metaDescription };

    // If a new image was uploaded, process it
    if (req.file) {
      updates.imageUrl = await uploadToCloudflare(req.file);
    }

    // Only update the slug if the title has changed (optional, but good for SEO consistency)
    if (title && title !== blog.title) {
      let baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = slug;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Server error updating blog" });
  }
};

// --- DELETE BLOG ---
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};