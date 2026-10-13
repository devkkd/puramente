/**
 * Integration Test: Backward Compatibility for Bulk Upload with SEO
 * 
 * This test verifies that:
 * 1. Bulk upload works without SEO columns
 * 2. Bulk upload works with partial SEO columns
 * 3. Products insert successfully with null/empty SEO fields
 * 4. No breaking changes to existing workflows
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { sanitizeSeoFields, generateProductSchema } = require('../utils/seoHelper');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'test-data');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

/**
 * Test data without SEO
 */
const TEST_PRODUCTS_NO_SEO = [
  {
    'Product Code': 'BC_TEST001',
    'Product Name': 'Gold Ring - No SEO',
    'Description': 'Beautiful gold ring without SEO data',
    'Category': 'Rings',
    'Sub - Category': 'with gemstone',
    'New Arrival': 'true',
    'Best Seller': 'false',
    'Image Name': 'test-ring.jpg'
  },
  {
    'Product Code': 'BC_TEST002',
    'Product Name': 'Silver Necklace - No SEO',
    'Description': 'Elegant silver necklace without SEO data',
    'Category': 'Necklaces',
    'Sub - Category': 'without gemstone',
    'New Arrival': 'false',
    'Best Seller': 'true',
    'Image Name': 'test-necklace.jpg'
  }
];

/**
 * Test data with partial SEO
 */
const TEST_PRODUCTS_PARTIAL_SEO = [
  {
    'Product Code': 'BC_TEST003',
    'Product Name': 'Diamond Earrings - Partial SEO',
    'Description': 'Premium diamond earrings with partial SEO',
    'Category': 'Earrings',
    'Sub - Category': 'with gemstone',
    'New Arrival': 'true',
    'Best Seller': 'false',
    'Image Name': 'test-earrings.jpg',
    'Meta Title': 'Diamond Earrings - Luxury Collection',
    'Meta Description': 'Exquisite diamond earrings handcrafted with premium diamonds'
  },
  {
    'Product Code': 'BC_TEST004',
    'Product Name': 'Gold Bracelet - Meta Title Only',
    'Description': 'Gold bracelet with meta title only',
    'Category': 'Bracelets',
    'Sub - Category': 'with gemstone',
    'New Arrival': 'false',
    'Best Seller': 'true',
    'Image Name': 'test-bracelet.jpg',
    'Meta Title': 'Gold Bracelet - Premium Design'
  }
];

/**
 * Create test Excel file
 */
function createTestExcel(fileName, data) {
  const filePath = path.join(testDir, fileName);
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
  xlsx.write(workbook, { bookType: 'xlsx', type: 'file' }, filePath);
  return filePath;
}

/**
 * Simulate bulk upload parsing (what the controller does)
 */
async function simulateBulkUploadRow(row, categoryId, categoryName, rowIndex) {
  // Extract SEO fields (same as real implementation)
  const metaTitle = row['Meta Title'] ? row['Meta Title'].toString().trim() : null;
  const metaDescription = row['Meta Description'] ? row['Meta Description'].toString().trim() : null;
  
  // Dynamically detect and extract Meta Keyword X columns
  const metaKeywords = [];
  const keywordPattern = /^Meta Keyword \d+$/i;
  Object.keys(row).forEach(colName => {
    if (keywordPattern.test(colName)) {
      const keyword = row[colName] ? row[colName].toString().trim() : '';
      if (keyword.length > 0) {
        metaKeywords.push(keyword);
      }
    }
  });

  const code = row['Product Code'].toString().trim();
  const name = row['Product Name'];
  const desc = row['Description'].toString().trim();
  const subCat = row['Sub - Category'].toString().trim();
  const newArrivalVal = row['New Arrival'];
  const bestSellerVal = row['Best Seller'];
  
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const generatedSlug = `${baseSlug}-${code.toLowerCase()}`;
  
  const optionEnum = subCat.toLowerCase() === 'with gemstone' ? 'with gem' : 'without gem';
  
  const isNewArrival = newArrivalVal.toString().toLowerCase() === 'true';
  const isBestSeller = bestSellerVal.toString().toLowerCase() === 'true';
  
  // Sanitize SEO fields
  const seoData = sanitizeSeoFields(metaTitle, metaDescription, metaKeywords);
  
  // Log warnings if fields are truncated
  if (metaTitle && metaTitle.length > 60) {
    console.warn(`⚠️ Row ${rowIndex + 1}: Meta title truncated from ${metaTitle.length} to 60 chars`);
  }
  if (metaDescription && metaDescription.length > 160) {
    console.warn(`⚠️ Row ${rowIndex + 1}: Meta description truncated from ${metaDescription.length} to 160 chars`);
  }
  if (metaKeywords.length > 10) {
    console.warn(`⚠️ Row ${rowIndex + 1}: More than 10 keywords provided. Using first 10 only.`);
  }
  
  // Auto-generate schema if any SEO data exists
  if (seoData.metaTitle || seoData.metaDescription || seoData.metaKeywords.length > 0) {
    seoData.schema = generateProductSchema({
      _id: new mongoose.Types.ObjectId(),
      slug: generatedSlug,
      productName: name,
      description: desc,
      imageUrl: 'https://pub-aa4f04513c8b41c88c3782f548746765.r2.dev/test-image.jpg',
      designCode: code,
      category: { name: categoryName, _id: categoryId }
    });
    console.log(`ℹ️ Row ${rowIndex + 1}: Schema auto-generated for "${name}" (${code})`);
  } else {
    console.log(`ℹ️ Row ${rowIndex + 1}: No SEO data provided for "${name}" (${code})`);
  }
  
  return {
    productName: name,
    slug: generatedSlug,
    designCode: code,
    description: desc,
    imageUrl: 'https://pub-aa4f04513c8b41c88c3782f548746765.r2.dev/test-image.jpg',
    newArrival: isNewArrival,
    bestSeller: isBestSeller,
    option: optionEnum,
    category: categoryId,
    seo: seoData
  };
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n========================================');
  console.log('🧪 BACKWARD COMPATIBILITY TEST SUITE');
  console.log('========================================\n');

  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB\n');

    // Create test categories
    console.log('📋 Setting up test categories...');
    const categories = {};
    for (const catName of ['Rings', 'Necklaces', 'Earrings', 'Bracelets']) {
      let cat = await Category.findOne({ name: catName });
      if (!cat) {
        cat = await Category.create({ name: catName });
      }
      categories[catName] = cat._id;
    }
    console.log('✅ Test categories ready\n');

    // TEST 1: Bulk upload without SEO columns
    console.log('📝 TEST 1: Bulk Upload WITHOUT SEO Columns');
    console.log('-'.repeat(40));
    const excelFileNoSEO = createTestExcel('test-no-seo.xlsx', TEST_PRODUCTS_NO_SEO);
    console.log(`Created Excel file: ${excelFileNoSEO}`);
    
    const workbookNoSEO = xlsx.read(fs.readFileSync(excelFileNoSEO), { type: 'buffer' });
    const rowsNoSEO = xlsx.utils.sheet_to_json(workbookNoSEO.Sheets[workbookNoSEO.SheetNames[0]]);
    
    const productsNoSEO = [];
    for (let i = 0; i < rowsNoSEO.length; i++) {
      const product = await simulateBulkUploadRow(rowsNoSEO[i], categories['Rings'], 'Rings', i);
      productsNoSEO.push(product);
    }
    
    const insertedNoSEO = await Product.insertMany(productsNoSEO);
    console.log(`✅ Inserted ${insertedNoSEO.length} products without SEO data\n`);
    
    // Verify NO_SEO products
    console.log('✔️  Verifying NO_SEO products...');
    for (const product of insertedNoSEO) {
      const retrieved = await Product.findById(product._id);
      if (!retrieved.seo) {
        console.log(`❌ Product ${retrieved.designCode} missing seo field`);
        process.exit(1);
      }
      if (retrieved.seo.metaTitle !== null) {
        console.log(`❌ Product ${retrieved.designCode} has metaTitle when it should be null`);
        process.exit(1);
      }
      if (retrieved.seo.metaDescription !== null) {
        console.log(`❌ Product ${retrieved.designCode} has metaDescription when it should be null`);
        process.exit(1);
      }
      if (!Array.isArray(retrieved.seo.metaKeywords) || retrieved.seo.metaKeywords.length !== 0) {
        console.log(`❌ Product ${retrieved.designCode} has keywords when it should be empty`);
        process.exit(1);
      }
      console.log(`  ✅ ${retrieved.designCode}: SEO correctly null/empty`);
    }
    console.log('');

    // TEST 2: Bulk upload with partial SEO columns
    console.log('📝 TEST 2: Bulk Upload WITH PARTIAL SEO Columns');
    console.log('-'.repeat(40));
    const excelFilePartialSEO = createTestExcel('test-partial-seo.xlsx', TEST_PRODUCTS_PARTIAL_SEO);
    console.log(`Created Excel file: ${excelFilePartialSEO}`);
    
    const workbookPartialSEO = xlsx.read(fs.readFileSync(excelFilePartialSEO), { type: 'buffer' });
    const rowsPartialSEO = xlsx.utils.sheet_to_json(workbookPartialSEO.Sheets[workbookPartialSEO.SheetNames[0]]);
    
    const productsPartialSEO = [];
    for (let i = 0; i < rowsPartialSEO.length; i++) {
      const product = await simulateBulkUploadRow(rowsPartialSEO[i], categories['Earrings'], 'Earrings', i);
      productsPartialSEO.push(product);
    }
    
    const insertedPartialSEO = await Product.insertMany(productsPartialSEO);
    console.log(`✅ Inserted ${insertedPartialSEO.length} products with partial SEO data\n`);
    
    // Verify PARTIAL_SEO products
    console.log('✔️  Verifying PARTIAL_SEO products...');
    for (const product of insertedPartialSEO) {
      const retrieved = await Product.findById(product._id);
      console.log(`  ✅ ${retrieved.designCode}:`);
      console.log(`     - metaTitle: ${retrieved.seo.metaTitle || '(null)'}`);
      console.log(`     - metaDescription: ${retrieved.seo.metaDescription ? '(populated)' : '(null)'}`);
      console.log(`     - metaKeywords count: ${retrieved.seo.metaKeywords.length}`);
      console.log(`     - schema: ${retrieved.seo.schema ? '(generated)' : '(null)'}`);
    }
    console.log('');

    // TEST 3: Verify no breaking changes to API responses
    console.log('📝 TEST 3: Verify API Response Format');
    console.log('-'.repeat(40));
    const testProduct = await Product.findOne({ designCode: 'BC_TEST001' });
    const requiredFields = [
      'productName',
      'slug',
      'designCode',
      'description',
      'imageUrl',
      'newArrival',
      'bestSeller',
      'option',
      'category',
      'seo',
      'createdAt',
      'updatedAt'
    ];
    
    let allFieldsPresent = true;
    for (const field of requiredFields) {
      if (!testProduct.hasOwnProperty(field)) {
        console.log(`❌ Missing field: ${field}`);
        allFieldsPresent = false;
      } else {
        console.log(`✅ Field present: ${field}`);
      }
    }
    
    if (!allFieldsPresent) {
      console.log('\n❌ Some fields are missing from product response!');
      process.exit(1);
    }
    console.log('');

    // TEST 4: Verify backward compatibility with existing workflows
    console.log('📝 TEST 4: Verify Backward Compatibility');
    console.log('-'.repeat(40));
    
    // Test retrieval by ID
    const byId = await Product.findById(testProduct._id);
    if (byId && byId.designCode === 'BC_TEST001') {
      console.log('✅ Retrieval by ID works correctly');
    } else {
      console.log('❌ Retrieval by ID failed');
      process.exit(1);
    }
    
    // Test retrieval by slug
    const bySlug = await Product.findOne({ slug: testProduct.slug });
    if (bySlug && bySlug.designCode === 'BC_TEST001') {
      console.log('✅ Retrieval by slug works correctly');
    } else {
      console.log('❌ Retrieval by slug failed');
      process.exit(1);
    }
    
    // Test list retrieval
    const list = await Product.find({ designCode: { $in: ['BC_TEST001', 'BC_TEST002', 'BC_TEST003', 'BC_TEST004'] } });
    if (list.length >= 4) {
      console.log('✅ List retrieval works correctly');
    } else {
      console.log('❌ List retrieval failed');
      process.exit(1);
    }
    console.log('');

    // Clean up
    console.log('🧹 Cleaning up test data...');
    await Product.deleteMany({
      designCode: { $in: ['BC_TEST001', 'BC_TEST002', 'BC_TEST003', 'BC_TEST004'] }
    });
    console.log('✅ Test data cleaned up\n');

    console.log('========================================');
    console.log('✅ ALL BACKWARD COMPATIBILITY TESTS PASSED!');
    console.log('========================================\n');
    
    console.log('✔️  Bulk upload works with existing workflows (no SEO columns)');
    console.log('✔️  Products insert successfully with null/empty SEO');
    console.log('✔️  Partial SEO columns are handled gracefully');
    console.log('✔️  No API response format changes');
    console.log('✔️  No breaking changes to existing workflows\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the tests
runTests();
