const Category = require("../models/Category");
const { uploadToCloudflare } = require("../utils/upload");
const { sanitizeSeoFields, generateCategorySchema } = require("../utils/seoHelper");

exports.createCategory = async (req, res) => {
  try {
    console.log("\n" + "=".repeat(70));
    console.log("🔵 🔵 🔵 [CREATE_CATEGORY] NEW REQUEST 🔵 🔵 🔵");
    console.log("=".repeat(70));
    console.log("req.method:", req.method);
    console.log("req.path:", req.path);
    console.log("req.headers['content-type']:", req.headers['content-type']);
    console.log("=".repeat(70));
    console.log("🔵 [CREATE_CATEGORY] Request received");
    console.log("📝 ALL req.body keys:", Object.keys(req.body));
    console.log("📝 Full req.body:", JSON.stringify(req.body, null, 2));
    console.log("📝 [CREATE_CATEGORY] req.body:", req.body);
    console.log("📝 [CREATE_CATEGORY] SEO fields check:");
    console.log("   - seo[metaTitle]:", req.body["seo[metaTitle]"]);
    console.log("   - seo[metaDescription]:", req.body["seo[metaDescription]"]);
    console.log("   - seo[metaKeywords][]:", req.body["seo[metaKeywords][]"]);
    
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

    // Handle SEO fields - check both bracket notation AND nested object
    let seoFields = {};
    
    // Check for nested req.body.seo object (from multer parsing FormData)
    if (req.body.seo && typeof req.body.seo === 'object') {
      console.log("✅ [CREATE_CATEGORY] SEO detected as nested object:", JSON.stringify(req.body.seo));
      seoFields = req.body.seo;
    } else {
      // Fallback: check for bracket notation (for backward compatibility)
      seoFields.metaTitle = req.body["seo[metaTitle]"];
      seoFields.metaDescription = req.body["seo[metaDescription]"];
      seoFields.metaKeywords = req.body["seo[metaKeywords][]"]
        ? (Array.isArray(req.body["seo[metaKeywords][]"]) ? req.body["seo[metaKeywords][]"] : [req.body["seo[metaKeywords][]"]])
        : [];
      seoFields.schema = req.body["seo[schema]"];
    }
    
    const hasSeoTitle = seoFields.metaTitle && String(seoFields.metaTitle).trim();
    const hasSeoDesc = seoFields.metaDescription && String(seoFields.metaDescription).trim();
    const hasSeoSchema = seoFields.schema && String(seoFields.schema).trim();
    const keywords = Array.isArray(seoFields.metaKeywords) ? seoFields.metaKeywords : [];
    const hasSeoKeywords = keywords.length > 0;
    
    if (hasSeoTitle || hasSeoDesc || hasSeoKeywords || hasSeoSchema) {
      console.log("✅ [CREATE_CATEGORY] SEO fields detected:");
      console.log("   - Title:", hasSeoTitle ? seoFields.metaTitle : "NO");
      console.log("   - Desc:", hasSeoDesc ? "YES" : "NO");
      console.log("   - Keywords:", keywords);
      console.log("   - Schema:", hasSeoSchema ? "YES" : "NO");
      
      const seoData = sanitizeSeoFields(seoFields.metaTitle, seoFields.metaDescription, keywords);
      console.log("   Sanitized result:", JSON.stringify(seoData));
      
      if (hasSeoSchema) {
        try { 
          seoData.schema = typeof seoFields.schema === 'string' ? JSON.parse(seoFields.schema) : seoFields.schema;
          console.log("   Schema parsed successfully");
        } catch(e) { 
          console.log("   Schema parse failed, auto-generating");
          seoData.schema = generateCategorySchema(category); 
        }
      } else {
        seoData.schema = generateCategorySchema(category);
      }
      category.seo = seoData;
      console.log("   Final SEO object set:", JSON.stringify(category.seo));
    }

    await category.save();
    console.log("✅ [CREATE_CATEGORY] Category saved successfully");
    console.log("   Category ID:", category._id);
    console.log("   Category SEO:", JSON.stringify(category.seo));
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
    
    // Handle SEO fields from bracket notation (same as createCategory)
    if (req.body["seo[metaTitle]"] !== undefined || req.body["seo[metaDescription]"] !== undefined || req.body["seo[schema]"] !== undefined) {
      console.log("✅ [CREATE_CATEGORY] SEO fields detected - processing...");
      const keywords = req.body["seo[metaKeywords][]"]
        ? (Array.isArray(req.body["seo[metaKeywords][]"]) ? req.body["seo[metaKeywords][]"] : [req.body["seo[metaKeywords][]"]])
        : [];
      console.log("   Sanitizing with: title='" + req.body["seo[metaTitle]"] + "', desc='" + req.body["seo[metaDescription]"] + "', keywords=" + JSON.stringify(keywords));
      const seoData = sanitizeSeoFields(req.body["seo[metaTitle]"], req.body["seo[metaDescription]"], keywords);
      console.log("   After sanitization: ", JSON.stringify(seoData));
      if (req.body["seo[schema]"]) {
        try { seoData.schema = JSON.parse(req.body["seo[schema]"]); } catch(e) { seoData.schema = generateCategorySchema(category); }
      } else {
        seoData.schema = generateCategorySchema(category);
      }
      updates.seo = seoData;
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

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Server error while deleting category" });
  }
};










