const Category = require("../models/Category");
const { uploadToCloudflare } = require("../utils/upload");
const { sanitizeSeoFields, generateCategorySchema } = require("../utils/seoHelper");

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

    if (req.body["seo[metaTitle]"] || req.body["seo[metaDescription]"] || req.body["seo[schema]"]) {
      const keywords = req.body["seo[metaKeywords][]"]
        ? (Array.isArray(req.body["seo[metaKeywords][]"]) ? req.body["seo[metaKeywords][]"] : [req.body["seo[metaKeywords][]"]])
        : [];
      const seoData = sanitizeSeoFields(req.body["seo[metaTitle]"], req.body["seo[metaDescription]"], keywords);
      if (req.body["seo[schema]"]) {
        try { seoData.schema = JSON.parse(req.body["seo[schema]"]); } catch(e) { seoData.schema = generateCategorySchema(category); }
      } else {
        seoData.schema = generateCategorySchema(category);
      }
      category.seo = seoData;
    }

    await category.save();
    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Server error while creating category" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error" });
  }
};

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

exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    const updates = { ...req.body };
    if (req.files) {
      if (req.files.homeImage) updates.homeImageUrl = await uploadToCloudflare(req.files.homeImage[0]);
      if (req.files.image) updates.imageUrl = await uploadToCloudflare(req.files.image[0]);
      if (req.files.storeBannerImage) updates.storeBannerUrl = await uploadToCloudflare(req.files.storeBannerImage[0]);
    }
    category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Server error while updating category" });
  }
};

exports.updateCategorySeo = async (req, res) => {
  try {
    const { metaTitle, metaDescription, metaKeywords, schema } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const seoData = sanitizeSeoFields(metaTitle, metaDescription, metaKeywords);

    if (schema && typeof schema === "object") {
      seoData.schema = schema;
    } else if (seoData.metaTitle || seoData.metaDescription) {
      seoData.schema = generateCategorySchema(category);
    }

    // Use $set on seo subdoc only — avoids required field validation on other fields
    const existingSeo = category.seo ? category.seo.toObject() : {};
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { seo: { ...existingSeo, ...seoData } } },
      { new: true, runValidators: false }
    );

    res.status(200).json({ success: true, message: "Category SEO updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating category SEO:", error);
    res.status(500).json({ error: "Server error while updating category SEO" });
  }
};