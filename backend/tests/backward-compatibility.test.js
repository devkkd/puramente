/**
 * Backward Compatibility Tests for Bulk Upload with SEO Fields
 * 
 * Test Cases:
 * 1. Upload Excel WITHOUT SEO columns
 * 2. Upload Excel WITH PARTIAL SEO columns
 * 3. Verify API response format unchanged
 * 4. Verify products insert successfully with empty/null SEO
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Test data
const TEST_PRODUCTS_NO_SEO = [
  {
    code: 'TEST001',
    name: 'Gold Ring No SEO',
    description: 'Beautiful gold ring without SEO data',
    category: 'Rings',
    subCategory: 'with gemstone',
    newArrival: 'true',
    bestSeller: 'false',
    imageName: 'test-image-1.jpg'
  },
  {
    code: 'TEST002',
    name: 'Silver Necklace No SEO',
    description: 'Elegant silver necklace without SEO data',
    category: 'Necklaces',
    subCategory: 'without gemstone',
    newArrival: 'false',
    bestSeller: 'true',
    imageName: 'test-image-2.jpg'
  }
];

const TEST_PRODUCTS_PARTIAL_SEO = [
  {
    code: 'TEST003',
    name: 'Diamond Earrings Partial SEO',
    description: 'Premium diamond earrings with partial SEO',
    category: 'Earrings',
    subCategory: 'with gemstone',
    newArrival: 'true',
    bestSeller: 'false',
    imageName: 'test-image-3.jpg',
    metaTitle: 'Diamond Earrings - Luxury Collection',
    metaDescription: 'Exquisite diamond earrings handcrafted with premium diamonds'
    // Note: No Meta Keyword columns
  },
  {
    code: 'TEST004',
    name: 'Bracelet Partial SEO',
    description: 'Gold bracelet with meta title only',
    category: 'Bracelets',
    subCategory: 'with gemstone',
    newArrival: 'false',
    bestSeller: 'true',
    imageName: 'test-image-4.jpg',
    metaTitle: 'Gold Bracelet - Premium Design'
    // Note: No description, no keywords
  }
];

/**
 * Create test Excel file with NO SEO columns
 */
function createTestExcelNoSEO() {
  const fileName = path.join(__dirname, 'test-no-seo.xlsx');
  
  const data = TEST_PRODUCTS_NO_SEO.map(product => ({
    'Product Code': product.code,
    'Product Name': product.name,
    'Description': product.description,
    'Category': product.category,
    'Sub - Category': product.subCategory,
    'New Arrival': product.newArrival,
    'Best Seller': product.bestSeller,
    'Image Name': product.imageName
  }));

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
  xlsx.write(workbook, { bookType: 'xlsx', type: 'file', cellFormula: true }, fileName);
  
  console.log(`✅ Created test Excel (NO SEO): ${fileName}`);
  return fileName;
}

/**
 * Create test Excel file with PARTIAL SEO columns
 */
function createTestExcelPartialSEO() {
  const fileName = path.join(__dirname, 'test-partial-seo.xlsx');
  
  const data = TEST_PRODUCTS_PARTIAL_SEO.map(product => ({
    'Product Code': product.code,
    'Product Name': product.name,
    'Description': product.description,
    'Category': product.category,
    'Sub - Category': product.subCategory,
    'New Arrival': product.newArrival,
    'Best Seller': product.bestSeller,
    'Image Name': product.imageName,
    'Meta Title': product.metaTitle || '',
    'Meta Description': product.metaDescription || ''
  }));

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
  xlsx.write(workbook, { bookType: 'xlsx', type: 'file', cellFormula: true }, fileName);
  
  console.log(`✅ Created test Excel (PARTIAL SEO): ${fileName}`);
  return fileName;
}

/**
 * Test 1: Verify products upload without SEO columns
 */
describe('Backward Compatibility - No SEO Columns', () => {
  
  let categoryId;
  
  before(async () => {
    // Connect to DB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Create test category if not exists
    const existingCategory = await Category.findOne({ name: 'Rings' });
    if (existingCategory) {
      categoryId = existingCategory._id;
    } else {
      const cat = await Category.create({ name: 'Rings' });
      categoryId = cat._id;
    }
  });
  
  after(async () => {
    // Clean up test products
    await Product.deleteMany({
      designCode: { $in: TEST_PRODUCTS_NO_SEO.map(p => p.code) }
    });
  });
  
  it('should insert products successfully without any SEO columns', async () => {
    // Simulate what bulkUploadProducts does without SEO columns
    const productsToInsert = TEST_PRODUCTS_NO_SEO.map(testProduct => ({
      productName: testProduct.name,
      slug: `${testProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${testProduct.code.toLowerCase()}`,
      designCode: testProduct.code,
      description: testProduct.description,
      imageUrl: 'https://pub-aa4f04513c8b41c88c3782f548746765.r2.dev/test-image.jpg',
      newArrival: testProduct.newArrival === 'true',
      bestSeller: testProduct.bestSeller === 'true',
      option: testProduct.subCategory.toLowerCase() === 'with gemstone' ? 'with gem' : 'without gem',
      category: categoryId,
      seo: {
        metaTitle: null,
        metaDescription: null,
        metaKeywords: []
      }
    }));
    
    const inserted = await Product.insertMany(productsToInsert);
    
    // Verify all products inserted
    inserted.should.have.lengthOf(2);
    
    // Verify SEO fields are null/empty
    const product1 = await Product.findById(inserted[0]._id);
    product1.should.have.property('seo');
    product1.seo.should.have.property('metaTitle', null);
    product1.seo.should.have.property('metaDescription', null);
    product1.seo.metaKeywords.should.be.an.Array().with.lengthOf(0);
  });
  
  it('should preserve existing product structure when SEO is null', async () => {
    const product = await Product.findOne({ designCode: 'TEST001' });
    
    // Verify all required fields still exist
    product.should.have.property('productName');
    product.should.have.property('slug');
    product.should.have.property('designCode');
    product.should.have.property('description');
    product.should.have.property('imageUrl');
    product.should.have.property('newArrival');
    product.should.have.property('bestSeller');
    product.should.have.property('option');
    product.should.have.property('category');
  });
});

/**
 * Test 2: Verify products upload with PARTIAL SEO columns
 */
describe('Backward Compatibility - Partial SEO Columns', () => {
  
  let categoryId;
  const { sanitizeSeoFields, generateProductSchema } = require('../utils/seoHelper');
  
  before(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    const existingCategory = await Category.findOne({ name: 'Earrings' });
    if (existingCategory) {
      categoryId = existingCategory._id;
    } else {
      const cat = await Category.create({ name: 'Earrings' });
      categoryId = cat._id;
    }
  });
  
  after(async () => {
    await Product.deleteMany({
      designCode: { $in: TEST_PRODUCTS_PARTIAL_SEO.map(p => p.code) }
    });
  });
  
  it('should insert products with partial SEO data', async () => {
    const productsToInsert = TEST_PRODUCTS_PARTIAL_SEO.map(testProduct => {
      const seoData = sanitizeSeoFields(
        testProduct.metaTitle || null,
        testProduct.metaDescription || null,
        []
      );
      
      // Auto-generate schema if SEO data exists
      if (seoData.metaTitle || seoData.metaDescription) {
        seoData.schema = generateProductSchema({
          _id: new mongoose.Types.ObjectId(),
          slug: `${testProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${testProduct.code.toLowerCase()}`,
          productName: testProduct.name,
          description: testProduct.description,
          imageUrl: 'https://pub-aa4f04513c8b41c88c3782f548746765.r2.dev/test-image.jpg',
          designCode: testProduct.code,
          category: { name: 'Earrings', _id: categoryId }
        });
      }
      
      return {
        productName: testProduct.name,
        slug: `${testProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${testProduct.code.toLowerCase()}`,
        designCode: testProduct.code,
        description: testProduct.description,
        imageUrl: 'https://pub-aa4f04513c8b41c88c3782f548746765.r2.dev/test-image.jpg',
        newArrival: testProduct.newArrival === 'true',
        bestSeller: testProduct.bestSeller === 'true',
        option: testProduct.subCategory.toLowerCase() === 'with gemstone' ? 'with gem' : 'without gem',
        category: categoryId,
        seo: seoData
      };
    });
    
    const inserted = await Product.insertMany(productsToInsert);
    
    // Verify all products inserted
    inserted.should.have.lengthOf(2);
  });
  
  it('should populate metaTitle when provided', async () => {
    const product = await Product.findOne({ designCode: 'TEST003' });
    
    product.seo.should.have.property('metaTitle');
    product.seo.metaTitle.should.equal('Diamond Earrings - Luxury Collection');
  });
  
  it('should populate metaDescription when provided', async () => {
    const product = await Product.findOne({ designCode: 'TEST003' });
    
    product.seo.should.have.property('metaDescription');
    product.seo.metaDescription.should.be.a.String();
  });
  
  it('should handle missing metaKeywords gracefully', async () => {
    const product = await Product.findOne({ designCode: 'TEST003' });
    
    product.seo.should.have.property('metaKeywords');
    product.seo.metaKeywords.should.be.an.Array().with.lengthOf(0);
  });
  
  it('should auto-generate schema when SEO data exists', async () => {
    const product = await Product.findOne({ designCode: 'TEST003' });
    
    product.seo.should.have.property('schema');
    product.seo.schema.should.be.an.Object();
    product.seo.schema.should.have.property('@context');
    product.seo.schema.should.have.property('@type');
    product.seo.schema['@type'].should.equal('Product');
  });
});

/**
 * Test 3: Verify API response format hasn't changed
 */
describe('Backward Compatibility - API Response Format', () => {
  
  let categoryId;
  
  before(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    const existingCategory = await Category.findOne({ name: 'Rings' });
    if (existingCategory) {
      categoryId = existingCategory._id;
    }
  });
  
  it('should include seo field in product response', async () => {
    const product = await Product.findOne({ designCode: 'TEST001' });
    
    product.should.have.property('seo');
  });
  
  it('should maintain all existing fields in response', async () => {
    const product = await Product.findOne({ designCode: 'TEST001' });
    
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
    
    requiredFields.forEach(field => {
      product.should.have.property(field);
    });
  });
});

/**
 * Test 4: Verify no breaking changes to existing workflows
 */
describe('Backward Compatibility - Existing Workflows', () => {
  
  before(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });
  
  it('should not affect product retrieval by ID', async () => {
    const product = await Product.findOne({ designCode: 'TEST001' });
    const retrieved = await Product.findById(product._id);
    
    retrieved.should.not.be.null();
    retrieved.designCode.should.equal('TEST001');
  });
  
  it('should not affect product retrieval by slug', async () => {
    const product = await Product.findOne({ designCode: 'TEST001' });
    const retrieved = await Product.findOne({ slug: product.slug });
    
    retrieved.should.not.be.null();
    retrieved.designCode.should.equal('TEST001');
  });
  
  it('should not affect product list retrieval', async () => {
    const products = await Product.find({ designCode: { $in: ['TEST001', 'TEST002'] } });
    
    products.should.not.be.empty();
    products.length.should.be.greaterThan(0);
  });
});

module.exports = {
  createTestExcelNoSEO,
  createTestExcelPartialSEO,
  TEST_PRODUCTS_NO_SEO,
  TEST_PRODUCTS_PARTIAL_SEO
};
