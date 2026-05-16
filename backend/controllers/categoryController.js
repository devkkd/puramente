const Category = require("../models/Category");
const { uploadToCloudflare } = require("../utils/upload");

// --- EXISTING: Create a new category ---
exports.createCategory = async (req, res) => {
  try {
    const { name, homeName } = req.body;

    if (!req.files || !req.files.homeImage || !req.files.image || !req.files.storeBannerImage) {
      return res.status(400).json({ error: "Main image, Home banner, and Store banner are all required." });
    }

    const [homeImageUrl, imageUrl, storeBannerUrl] = await Promise.all([
      uploadToCloudflare(req.files.homeImage[0]),
      uploadToCloudflare(req.files.image[0]),
      uploadToCloudflare(req.files.storeBannerImage[0])
    ]);

    const category = new Category({ name, homeName, homeImageUrl, imageUrl, storeBannerUrl });
    await category.save();

    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Server error while creating category" });
  }
};

// --- EXISTING: Get all categories ---
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- NEW: Get single category by ID ---
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- NEW: Update category ---
exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const updates = { ...req.body };

    // Handle optional image uploads
    if (req.files) {
      if (req.files.homeImage) {
        updates.homeImageUrl = await uploadToCloudflare(req.files.homeImage[0]);
      }
      if (req.files.image) {
        updates.imageUrl = await uploadToCloudflare(req.files.image[0]);
      }
      if (req.files.storeBannerImage) {
        updates.storeBannerUrl = await uploadToCloudflare(req.files.storeBannerImage[0]);
      }
    }

    category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Server error while updating category" });
  }
};