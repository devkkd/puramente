const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadToCloudflare } = require("../utils/upload");
const xlsx = require("xlsx");

// --- EXISTING: Create a new product ---
exports.createProduct = async (req, res) => {
  try {
    const { productName, designCode, description, newArrival, bestSeller, option, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required." });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found." });
    }

    const baseSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const generatedSlug = `${baseSlug}-${designCode.toLowerCase()}`;

    const imageUrl = await uploadToCloudflare(req.file);

    const product = new Product({
      productName,
      slug: generatedSlug,
      designCode,
      description,
      imageUrl,
      newArrival: newArrival === "true" || newArrival === true,
      bestSeller: bestSeller === "true" || bestSeller === true,
      option,
      category
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `A product with this ${field} already exists.` });
    }
    res.status(500).json({ error: "Server error while creating product" });
  }
};

// --- EXISTING: Get all products ---
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error while fetching products" });
  }
};

// --- NEW: Get single product by ID ---
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    res.status(500).json({ error: "Server error while fetching product" });
  }
};

// --- NEW: Get single product by Slug ---
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ error: "Server error while fetching product" });
  }
};

// --- NEW: Update a product ---
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updates = { ...req.body };

    // 1. Validate category if it's being changed
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) return res.status(404).json({ error: "Category not found." });
    }

    // 2. Parse boolean fields properly from FormData
    if (updates.newArrival !== undefined) {
      updates.newArrival = updates.newArrival === "true" || updates.newArrival === true;
    }
    if (updates.bestSeller !== undefined) {
      updates.bestSeller = updates.bestSeller === "true" || updates.bestSeller === true;
    }

    // 3. Handle optional Image Upload
    if (req.file) {
      updates.imageUrl = await uploadToCloudflare(req.file);
    }

    // 4. Re-generate Slug IF productName or designCode changes
    if (updates.productName || updates.designCode) {
      const nameToUse = updates.productName || product.productName;
      const codeToUse = updates.designCode || product.designCode;

      const baseSlug = nameToUse.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      updates.slug = `${baseSlug}-${codeToUse.toLowerCase()}`;
    }

    // 5. Update in DB
    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true, // Return the updated document
      runValidators: true // Ensure enum values (with gem/without gem) are validated
    }).populate("category", "name");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `A product with this ${field} already exists.` });
    }
    res.status(500).json({ error: "Server error while updating product" });
  }
};

// --- NEW: Delete a product ---
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Note: If you want to delete the image from Cloudflare to save space, 
    // you would call a deleteFromCloudflare(product.imageUrl) utility here.

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    res.status(500).json({ error: "Server error while deleting product" });
  }
};

// --- UPDATED: Bulk Upload Controller (Background Processing) ---
exports.bulkUploadProducts = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const excelFile = req.files.find(file => file.originalname.match(/\.(xlsx|xls|csv)$/i));
    const images = req.files.filter(file => file.mimetype.startsWith('image/'));

    if (!excelFile) {
      return res.status(400).json({ error: "Excel file is required." });
    }

    // 1. Immediately tell the Frontend "Success" so it doesn't time out
    res.status(202).json({
      success: true,
      message: "Bulk upload received! Processing 1000+ items in the background. Check your backend terminal for live progress, and refresh the Products table in 5-10 minutes."
    });

    // 2. BACKGROUND WORKER (Runs after response is sent)
    (async () => {
      try {
        console.log("\n🚀 BACKGROUND WORKER STARTED: Parsing Excel File...");
        const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; 
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const categoriesDB = await Category.find();
        const productsToInsert = [];
        let successCount = 0;
        let skipCount = 0;

        console.log(`📦 Found ${rows.length} rows in Excel. Starting Cloudflare uploads...`);

        // Loop through Excel rows sequentially to prevent Cloudflare rate limits
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const code = row['Product Code'] ? row['Product Code'].toString().trim() : null;
          const name = row['Product Name'];
          const desc = row['Description'];
          const catName = row['Category'] ? row['Category'].toString().trim() : null;
          const subCat = row['Sub - Category'] ? row['Sub - Category'].toString().trim() : "";

          if (!code || !name) continue; 

          // SMART EXACT IMAGE MATCHING (Fixes "RS10" matching "RS100.jpg")
          const matchedImage = images.find(img => {
            const fileName = img.originalname.split('/').pop().split('\\').pop();
            const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')); // Removes .jpg
            return nameWithoutExt.toUpperCase() === code.toUpperCase();
          });

          if (!matchedImage) {
            skipCount++;
            continue; 
          }

          let categoryId = null;
          if (catName) {
            const normalizedExcelCat = catName.toLowerCase();
            const match = categoriesDB.find(c => 
              c.name.toLowerCase() === normalizedExcelCat || 
              c.name.toLowerCase() === `${normalizedExcelCat}s`
            );
            if (match) categoryId = match._id;
          }

          if (!categoryId) {
            skipCount++;
            continue;
          }

          // Upload to Cloudflare
          const imageUrl = await uploadToCloudflare(matchedImage);

          const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const generatedSlug = `${baseSlug}-${code.toLowerCase()}`;
          const optionEnum = subCat.toLowerCase() === "with gemstone" ? "with gem" : "without gem";

          productsToInsert.push({
            productName: name,
            slug: generatedSlug,
            designCode: code,
            description: desc,
            imageUrl: imageUrl,
            newArrival: true,
            bestSeller: false,
            option: optionEnum,
            category: categoryId
          });

          successCount++;

          // Log progress every 50 items so you know it's working
          if (successCount % 50 === 0) {
            console.log(`⏳ Uploaded ${successCount} / ${rows.length} items to Cloudflare...`);
          }
        }

        // Save everything to MongoDB at the very end
        if (productsToInsert.length > 0) {
          console.log(`💾 Saving ${productsToInsert.length} products to MongoDB...`);
          await Product.insertMany(productsToInsert);
        }

        console.log(`✅ BACKGROUND TASK COMPLETE! Successfully added ${successCount} products. Skipped ${skipCount}.`);

      } catch (bgError) {
        console.error("❌ Background Worker Crashed:", bgError);
      }
    })();

  } catch (error) {
    console.error("Bulk Upload Init Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error initializing bulk upload." });
    }
  }
};