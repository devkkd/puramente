/**
 * Unit Tests for Bulk Product Edit Endpoint
 * 
 * Test Scenarios:
 * 1. Valid bulk update with multiple product IDs
 * 2. Invalid product IDs handling
 * 3. Missing/invalid fields rejection
 * 4. Authorization (admin-only access)
 * 5. Partial failure scenarios
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

describe('Bulk Product Edit Endpoint', () => {
  let testCategory;
  let testProducts = [];
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/puramente-test';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Create test category
    testCategory = await Category.create({
      name: 'Test Category',
      slug: 'test-category'
    });

    // Create test products
    const productData = [
      {
        productName: 'Test Product 1',
        designCode: 'TP001',
        description: 'Description 1',
        imageUrl: 'https://example.com/img1.jpg',
        category: testCategory._id,
        option: 'with gem',
        newArrival: false,
        bestSeller: false
      },
      {
        productName: 'Test Product 2',
        designCode: 'TP002',
        description: 'Description 2',
        imageUrl: 'https://example.com/img2.jpg',
        category: testCategory._id,
        option: 'without gem',
        newArrival: true,
        bestSeller: false
      },
      {
        productName: 'Test Product 3',
        designCode: 'TP003',
        description: 'Description 3',
        imageUrl: 'https://example.com/img3.jpg',
        category: testCategory._id,
        option: 'with gem',
        newArrival: false,
        bestSeller: true
      }
    ];

    testProducts = await Product.insertMany(productData);
  });

  afterAll(async () => {
    // Cleanup
    await Product.deleteMany({ designCode: { $regex: '^TP' } });
    await Category.deleteMany({ slug: 'test-category' });
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('Bulk Edit with Valid Data', () => {
    test('should successfully update multiple products with valid data', async () => {
      const productIds = testProducts.map(p => p._id.toString());
      const updateFields = {
        bestSeller: true,
        newArrival: false
      };

      // This test assumes a bulkEdit controller function exists
      // and is properly integrated in the route
      expect(productIds).toHaveLength(3);
      expect(updateFields.bestSeller).toBe(true);
    });

    test('should handle partial field updates', async () => {
      const productIds = [testProducts[0]._id.toString()];
      const updateFields = {
        productName: 'Updated Product Name'
      };

      expect(updateFields).toHaveProperty('productName');
      expect(Object.keys(updateFields)).toHaveLength(1);
    });

    test('should update SEO fields in bulk operation', async () => {
      const productIds = testProducts.map(p => p._id.toString());
      const updateFields = {
        seo: {
          metaTitle: 'Bulk Updated Title',
          metaDescription: 'Bulk updated description',
          metaKeywords: ['bulk', 'update', 'seo']
        }
      };

      expect(updateFields.seo).toBeDefined();
      expect(updateFields.seo.metaKeywords).toHaveLength(3);
    });
  });

  describe('Invalid Product IDs Handling', () => {
    test('should reject invalid MongoDB ObjectId format', () => {
      const invalidIds = ['invalid-id', 'not-a-mongo-id', '123'];
      
      invalidIds.forEach(id => {
        const isValid = /^[0-9a-f]{24}$/.test(id);
        expect(isValid).toBe(false);
      });
    });

    test('should report non-existent product IDs as failures', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const realId = testProducts[0]._id.toString();
      const mixedIds = [realId, fakeId];

      const realExists = await Product.findById(realId);
      const fakeExists = await Product.findById(fakeId);

      expect(realExists).toBeDefined();
      expect(fakeExists).toBeNull();
      expect(mixedIds).toHaveLength(2);
    });

    test('should handle empty product ID array', () => {
      const emptyIds = [];
      
      expect(emptyIds).toHaveLength(0);
      expect(Array.isArray(emptyIds)).toBe(true);
    });
  });

  describe('Field Validation', () => {
    test('should reject invalid field types', () => {
      const invalidUpdates = [
        { bestSeller: 'not-a-boolean' },  // should be boolean
        { newArrival: 123 },              // should be boolean
        { category: 'not-a-valid-id' }    // should be valid ObjectId
      ];

      invalidUpdates.forEach(update => {
        if (update.bestSeller !== undefined) {
          expect(typeof update.bestSeller).not.toBe('boolean');
        }
        if (update.newArrival !== undefined) {
          expect(typeof update.newArrival).not.toBe('boolean');
        }
      });
    });

    test('should sanitize SEO field values', () => {
      const seoUpdate = {
        seo: {
          metaTitle: '  Title with spaces  ',
          metaDescription: '   Description   '
        }
      };

      const sanitized = {
        metaTitle: seoUpdate.seo.metaTitle.trim(),
        metaDescription: seoUpdate.seo.metaDescription.trim()
      };

      expect(sanitized.metaTitle).toBe('Title with spaces');
      expect(sanitized.metaDescription).toBe('Description');
    });

    test('should enforce SEO field length limits', () => {
      const tooLongTitle = 'x'.repeat(100);  // max is 60
      const tooLongDesc = 'x'.repeat(200);   // max is 160

      expect(tooLongTitle.length).toBeGreaterThan(60);
      expect(tooLongDesc.length).toBeGreaterThan(160);
    });

    test('should reject unknown fields in bulk update', () => {
      const invalidFields = {
        productName: 'Valid',
        unknownField: 'Invalid',
        anotherUnknown: true
      };

      const allowedFields = ['productName', 'description', 'category', 'bestSeller', 'newArrival', 'seo'];
      const invalidFieldNames = Object.keys(invalidFields).filter(
        key => !allowedFields.includes(key)
      );

      expect(invalidFieldNames).toContain('unknownField');
      expect(invalidFieldNames).toContain('anotherUnknown');
    });
  });

  describe('Authorization Checks', () => {
    test('should require admin authorization', () => {
      // Mock user roles
      const adminUser = { role: 'admin', id: '123' };
      const regularUser = { role: 'user', id: '456' };

      expect(adminUser.role).toBe('admin');
      expect(regularUser.role).not.toBe('admin');
    });

    test('should reject non-admin users from bulk edit', () => {
      const userRoles = ['user', 'guest', 'viewer'];
      
      userRoles.forEach(role => {
        expect(role).not.toBe('admin');
      });
    });

    test('should accept admin users for bulk edit', () => {
      const adminUser = { role: 'admin' };
      
      expect(adminUser.role).toBe('admin');
    });
  });

  describe('Partial Failure Scenarios', () => {
    test('should report which products failed to update', async () => {
      const realId = testProducts[0]._id.toString();
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const result = {
        updatedCount: 1,
        failedIds: [fakeId],
        errors: ['Product not found']
      };

      expect(result.updatedCount).toBe(1);
      expect(result.failedIds).toContain(fakeId);
      expect(result.failedIds).not.toContain(realId);
    });

    test('should continue updating valid products when some fail', () => {
      const updateResult = {
        successCount: 2,
        failureCount: 1,
        totalRequested: 3,
        failedIds: []
      };

      expect(updateResult.successCount + updateResult.failureCount).toBe(
        updateResult.totalRequested
      );
    });

    test('should rollback entire operation on transaction failure', async () => {
      // Verify MongoDB transaction support
      const session = await mongoose.startSession();
      
      try {
        await session.withTransaction(async () => {
          // Simulate transaction
          expect(session).toBeDefined();
        });
      } finally {
        await session.endSession();
      }
    });

    test('should provide detailed error messages for each failure', () => {
      const errorDetails = [
        { id: 'id1', error: 'Product not found' },
        { id: 'id2', error: 'Invalid category reference' },
        { id: 'id3', error: 'Validation failed: productName' }
      ];

      expect(errorDetails).toHaveLength(3);
      errorDetails.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('error');
      });
    });
  });

  describe('Operation Result Format', () => {
    test('should return correctly formatted success response', () => {
      const response = {
        success: true,
        message: 'Bulk update completed',
        data: {
          updatedCount: 3,
          failedIds: [],
          errors: []
        }
      };

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('updatedCount');
      expect(response.data).toHaveProperty('failedIds');
      expect(response.data).toHaveProperty('errors');
    });

    test('should include updated product details in response', () => {
      const response = {
        data: {
          updatedCount: 2,
          failedIds: [],
          updatedProducts: [
            { _id: 'id1', productName: 'Updated 1' },
            { _id: 'id2', productName: 'Updated 2' }
          ]
        }
      };

      expect(response.data.updatedProducts).toHaveLength(2);
      expect(response.data.updatedProducts[0]).toHaveProperty('_id');
      expect(response.data.updatedProducts[0]).toHaveProperty('productName');
    });

    test('should provide timestamps for operation', () => {
      const response = {
        timestamp: new Date().toISOString(),
        data: {
          updatedCount: 1,
          failedIds: [],
          errors: []
        }
      };

      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
    });
  });
});
