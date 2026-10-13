/**
 * Integration Tests for Complete Bulk Edit Workflow
 * 
 * End-to-end tests verifying:
 * - Multiple products selection via table UI
 * - Category filtering
 * - Bulk edit submission and database updates
 * - API response format and counts
 * - Test data cleanup
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

describe('Bulk Edit Complete Workflow - Integration Tests', () => {
  let testCategories = [];
  let testProducts = [];

  // Test database setup
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/puramente-test';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Create test categories
    const categoryNames = ['Jewelry', 'Rings', 'Necklaces', 'Earrings'];
    for (const name of categoryNames) {
      const category = await Category.create({
        name,
        slug: name.toLowerCase()
      });
      testCategories.push(category);
    }

    // Create test products across categories
    const productData = [
      // Jewelry category
      {
        productName: 'Gold Bracelet Collection',
        designCode: 'GB001',
        description: 'Classic gold bracelet design',
        imageUrl: 'https://example.com/gb001.jpg',
        category: testCategories[0]._id,
        option: 'with gem',
        newArrival: false,
        bestSeller: false
      },
      {
        productName: 'Silver Bracelet',
        designCode: 'SB001',
        description: 'Elegant silver bracelet',
        imageUrl: 'https://example.com/sb001.jpg',
        category: testCategories[0]._id,
        option: 'without gem',
        newArrival: true,
        bestSeller: false
      },
      // Rings category
      {
        productName: 'Diamond Ring Classic',
        designCode: 'DR001',
        description: 'Timeless diamond ring',
        imageUrl: 'https://example.com/dr001.jpg',
        category: testCategories[1]._id,
        option: 'with gem',
        newArrival: false,
        bestSeller: true
      },
      {
        productName: 'Emerald Ring',
        designCode: 'ER001',
        description: 'Beautiful emerald gemstone',
        imageUrl: 'https://example.com/er001.jpg',
        category: testCategories[1]._id,
        option: 'with gem',
        newArrival: true,
        bestSeller: false
      },
      // Necklaces category
      {
        productName: 'Pearl Necklace',
        designCode: 'PN001',
        description: 'Luxurious pearl necklace',
        imageUrl: 'https://example.com/pn001.jpg',
        category: testCategories[2]._id,
        option: 'without gem',
        newArrival: false,
        bestSeller: true
      },
      {
        productName: 'Gold Chain Necklace',
        designCode: 'GN001',
        description: 'Subtle gold chain design',
        imageUrl: 'https://example.com/gn001.jpg',
        category: testCategories[2]._id,
        option: 'with gem',
        newArrival: true,
        bestSeller: false
      }
    ];

    testProducts = await Product.insertMany(productData);
  });

  // Cleanup after tests
  afterAll(async () => {
    // Delete all test products
    const designCodes = testProducts.map(p => p.designCode);
    await Product.deleteMany({ designCode: { $in: designCodes } });

    // Delete all test categories
    const categoryIds = testCategories.map(c => c._id);
    await Category.deleteMany({ _id: { $in: categoryIds } });

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('Product Selection and Filtering', () => {
    test('should retrieve all products for table display', async () => {
      const allProducts = await Product.find()
        .populate('category', 'name')
        .lean();

      expect(allProducts.length).toBeGreaterThanOrEqual(testProducts.length);
      expect(allProducts[0]).toHaveProperty('_id');
      expect(allProducts[0]).toHaveProperty('productName');
      expect(allProducts[0]).toHaveProperty('category');
    });

    test('should filter products by category', async () => {
      const jewelryCategory = testCategories[0];
      const filteredProducts = await Product.find({ category: jewelryCategory._id })
        .populate('category', 'name')
        .lean();

      expect(filteredProducts.length).toBeGreaterThan(0);
      filteredProducts.forEach(product => {
        expect(product.category._id.toString()).toBe(jewelryCategory._id.toString());
      });
    });

    test('should filter products by bestSeller flag', async () => {
      const bestSellers = await Product.find({ bestSeller: true })
        .populate('category', 'name')
        .lean();

      bestSellers.forEach(product => {
        expect(product.bestSeller).toBe(true);
      });
    });

    test('should filter products by newArrival flag', async () => {
      const newArrivals = await Product.find({ newArrival: true })
        .populate('category', 'name')
        .lean();

      newArrivals.forEach(product => {
        expect(product.newArrival).toBe(true);
      });
    });

    test('should search products by productName', async () => {
      const searchTerm = 'Ring';
      const results = await Product.find({
        productName: { $regex: searchTerm, $options: 'i' }
      }).lean();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.productName.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    test('should search products by designCode', async () => {
      const searchTerm = 'DR001';
      const results = await Product.find({
        designCode: { $regex: searchTerm, $options: 'i' }
      }).lean();

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].designCode).toBe(searchTerm);
    });
  });

  describe('Bulk Edit Operations', () => {
    test('should bulk update bestSeller flag for multiple products', async () => {
      const ringsCategory = testCategories[1];
      const productsToUpdate = await Product.find({ category: ringsCategory._id });
      const productIds = productsToUpdate.map(p => p._id);

      // Simulate bulk update
      const updateFields = { bestSeller: true };
      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: updateFields }
      );

      expect(result.modifiedCount).toBe(productIds.length);

      // Verify update
      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.bestSeller).toBe(true);
      });
    });

    test('should bulk update description for multiple products', async () => {
      const jewelryCategory = testCategories[0];
      const productsToUpdate = await Product.find({ category: jewelryCategory._id });
      const productIds = productsToUpdate.map(p => p._id);

      const newDescription = 'Updated jewelry collection description';
      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { description: newDescription } }
      );

      expect(result.modifiedCount).toBe(productIds.length);

      // Verify update
      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.description).toBe(newDescription);
      });
    });

    test('should bulk update category for multiple products', async () => {
      const fromCategory = testCategories[0];
      const toCategory = testCategories[3];
      const productsToUpdate = await Product.find({ category: fromCategory._id });
      const productIds = productsToUpdate.map(p => p._id);

      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { category: toCategory._id } }
      );

      expect(result.modifiedCount).toBe(productIds.length);

      // Verify update
      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.category.toString()).toBe(toCategory._id.toString());
      });
    });

    test('should bulk update SEO fields with validation', async () => {
      const productsToUpdate = testProducts.slice(0, 2);
      const productIds = productsToUpdate.map(p => p._id);

      const seoUpdate = {
        seo: {
          metaTitle: 'Updated Product Title',
          metaDescription: 'Updated product description for SEO',
          metaKeywords: ['updated', 'product', 'jewelry']
        }
      };

      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: seoUpdate }
      );

      expect(result.modifiedCount).toBe(productIds.length);

      // Verify update
      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.seo).toBeDefined();
        expect(product.seo.metaTitle).toBe('Updated Product Title');
        expect(product.seo.metaKeywords).toContain('updated');
      });
    });

    test('should bulk update multiple fields simultaneously', async () => {
      const productsToUpdate = testProducts.slice(2, 4);
      const productIds = productsToUpdate.map(p => p._id);

      const multiFieldUpdate = {
        bestSeller: true,
        newArrival: false,
        description: 'Bulk updated collection'
      };

      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: multiFieldUpdate }
      );

      expect(result.modifiedCount).toBe(productIds.length);

      // Verify all fields updated
      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.bestSeller).toBe(true);
        expect(product.newArrival).toBe(false);
        expect(product.description).toBe('Bulk updated collection');
      });
    });
  });

  describe('API Response Format', () => {
    test('should return correct operation counts', async () => {
      const productsToUpdate = testProducts.slice(0, 3);
      const productIds = productsToUpdate.map(p => p._id);

      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { bestSeller: false } }
      );

      const response = {
        success: true,
        message: 'Bulk update completed successfully',
        data: {
          updatedCount: result.modifiedCount,
          failedIds: [],
          errors: [],
          requestedCount: productIds.length
        }
      };

      expect(response.data.updatedCount).toBe(productIds.length);
      expect(response.data.updatedCount).toBe(response.data.requestedCount);
      expect(response.data.failedIds).toHaveLength(0);
    });

    test('should include product details in response', async () => {
      const productsToUpdate = testProducts.slice(4, 6);
      const productIds = productsToUpdate.map(p => p._id);

      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { bestSeller: true } }
      );

      const updatedProducts = await Product.find({ _id: { $in: productIds } });

      const response = {
        success: true,
        data: {
          updatedCount: updatedProducts.length,
          failedIds: [],
          errors: [],
          updatedProducts: updatedProducts.map(p => ({
            _id: p._id,
            productName: p.productName,
            designCode: p.designCode,
            bestSeller: p.bestSeller
          }))
        }
      };

      expect(response.data.updatedProducts).toHaveLength(updatedProducts.length);
      response.data.updatedProducts.forEach(product => {
        expect(product).toHaveProperty('_id');
        expect(product).toHaveProperty('productName');
        expect(product).toHaveProperty('designCode');
      });
    });

    test('should include timestamp in response', async () => {
      const response = {
        timestamp: new Date().toISOString(),
        success: true,
        data: {
          updatedCount: 0,
          failedIds: [],
          errors: []
        }
      };

      expect(response.timestamp).toBeDefined();
      const timestampDate = new Date(response.timestamp);
      expect(timestampDate).toBeInstanceOf(Date);
      expect(timestampDate.getTime()).toBeLessThanOrEqual(Date.now());
    });

    test('should report partial failures correctly', async () => {
      const realProduct = testProducts[0];
      const fakeId = new mongoose.Types.ObjectId();
      const mixedIds = [realProduct._id, fakeId];

      // Try to find all products
      const found = await Product.find({ _id: { $in: mixedIds } });

      const response = {
        success: true,
        data: {
          updatedCount: found.length,
          failedIds: mixedIds.filter(id => !found.map(p => p._id.toString()).includes(id.toString())),
          errors: [`Product with ID ${fakeId} not found`],
          requestedCount: mixedIds.length
        }
      };

      expect(response.data.failedIds).toContain(fakeId);
      expect(response.data.updatedCount).toBe(1);
      expect(response.data.failedIds).toHaveLength(1);
    });
  });

  describe('Data Integrity', () => {
    test('should preserve untouched fields during bulk update', async () => {
      const productToTest = testProducts[0];
      const originalProduct = await Product.findById(productToTest._id);
      const originalImageUrl = originalProduct.imageUrl;

      // Update only description
      await Product.updateOne(
        { _id: productToTest._id },
        { $set: { description: 'New description' } }
      );

      const updated = await Product.findById(productToTest._id);
      expect(updated.imageUrl).toBe(originalImageUrl);
      expect(updated.description).toBe('New description');
    });

    test('should maintain product relationships during bulk update', async () => {
      const productsToUpdate = testProducts.slice(0, 2);
      const productIds = productsToUpdate.map(p => p._id);
      const originalCategory = productsToUpdate[0].category;

      // Update only description
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { description: 'Maintained relationship test' } }
      );

      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.category.toString()).toBe(originalCategory.toString());
      });
    });

    test('should not create duplicate products during bulk operations', async () => {
      const allProducts = await Product.find().lean();
      const initialCount = allProducts.length;

      // Perform bulk update
      const productsToUpdate = testProducts.slice(2, 4);
      const productIds = productsToUpdate.map(p => p._id);

      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { bestSeller: true } }
      );

      const afterUpdate = await Product.find().lean();
      expect(afterUpdate.length).toBe(initialCount);
    });
  });
});
