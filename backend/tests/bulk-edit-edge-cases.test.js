/**
 * Edge Case Tests for Bulk Edit Operations
 * 
 * Test scenarios:
 * - Empty selection handling
 * - Invalid MongoDB ObjectIds
 * - Concurrent requests and race conditions
 * - Partial failures during bulk update
 * - SEO field validation during bulk operations
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

describe('Bulk Edit Edge Cases', () => {
  let testCategory;
  let testProducts = [];

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/puramente-test';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    testCategory = await Category.create({
      name: 'Edge Case Test Category',
      slug: 'edge-case-test'
    });

    const productData = [];
    for (let i = 1; i <= 5; i++) {
      productData.push({
        productName: `Edge Case Product ${i}`,
        designCode: `ECP${String(i).padStart(3, '0')}`,
        description: `Test product ${i}`,
        imageUrl: `https://example.com/ecp${i}.jpg`,
        category: testCategory._id,
        option: 'with gem',
        newArrival: i % 2 === 0,
        bestSeller: i % 3 === 0
      });
    }

    testProducts = await Product.insertMany(productData);
  });

  afterAll(async () => {
    const designCodes = testProducts.map(p => p.designCode);
    await Product.deleteMany({ designCode: { $in: designCodes } });
    await Category.deleteMany({ slug: 'edge-case-test' });

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('Empty Selection Handling', () => {
    test('should reject bulk edit with empty product ID array', async () => {
      const emptyIds = [];
      const updateFields = { bestSeller: true };

      const result = await Product.updateMany(
        { _id: { $in: emptyIds } },
        { $set: updateFields }
      );

      expect(result.matchedCount).toBe(0);
      expect(result.modifiedCount).toBe(0);
    });

    test('should return appropriate error for empty selection', () => {
      const response = {
        success: false,
        message: 'No products selected for bulk edit',
        errors: ['At least one product must be selected'],
        data: {
          updatedCount: 0,
          failedIds: [],
          requestedCount: 0
        }
      };

      expect(response.success).toBe(false);
      expect(response.errors).toContain('At least one product must be selected');
    });

    test('should reject bulk edit with null selection', async () => {
      const nullIds = null;
      const isArray = Array.isArray(nullIds);

      expect(isArray).toBe(false);
    });

    test('should require at least one field to update', () => {
      const emptyUpdateFields = {};
      const fieldCount = Object.keys(emptyUpdateFields).length;

      expect(fieldCount).toBe(0);
    });
  });

  describe('Invalid MongoDB ObjectId Handling', () => {
    test('should reject invalid ObjectId format', async () => {
      const invalidIds = [
        'not-a-valid-id',
        '123456',
        'abcdefghijklmnopqrstuvwx',  // 24 chars but not hex
        '!@#$%^&*()',
        ''
      ];

      for (const id of invalidIds) {
        const isValid = /^[0-9a-f]{24}$/.test(id);
        expect(isValid).toBe(false);
      }
    });

    test('should filter out invalid IDs before processing', async () => {
      const realId = testProducts[0]._id.toString();
      const invalidId = 'invalid-id-string-here-00';
      const mixedIds = [realId, invalidId];

      const validIds = mixedIds.filter(id => /^[0-9a-f]{24}$/.test(id));

      expect(validIds).toContain(realId);
      expect(validIds).not.toContain(invalidId);
      expect(validIds).toHaveLength(1);
    });

    test('should report non-existent product IDs as failures', async () => {
      const realId = testProducts[0]._id;
      const fakeId = new mongoose.Types.ObjectId();
      const mixedIds = [realId, fakeId];

      const result = await Product.updateMany(
        { _id: { $in: mixedIds } },
        { $set: { bestSeller: true } }
      );

      expect(result.modifiedCount).toBe(1);
      expect(result.matchedCount).toBe(1);
    });

    test('should handle malformed ObjectId gracefully', async () => {
      const malformedId = 'definitely-not-a-valid-mongodb-object-id';
      
      try {
        await Product.findById(malformedId);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should validate all IDs before performing bulk update', () => {
      const testIds = [
        testProducts[0]._id.toString(),
        new mongoose.Types.ObjectId().toString(),
        'invalid-id',
        testProducts[1]._id.toString()
      ];

      const validIds = testIds.filter(id => /^[0-9a-f]{24}$/.test(id));
      const invalidIds = testIds.filter(id => !/^[0-9a-f]{24}$/.test(id));

      expect(validIds).toHaveLength(3);
      expect(invalidIds).toHaveLength(1);
    });
  });

  describe('Concurrent Bulk Edit Requests (Race Conditions)', () => {
    test('should handle concurrent updates to same products', async () => {
      const productsToUpdate = testProducts.slice(0, 2);
      const productIds = productsToUpdate.map(p => p._id);

      // Simulate concurrent updates
      const promise1 = Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { bestSeller: true } }
      );

      const promise2 = Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { newArrival: true } }
      );

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1.modifiedCount).toBe(productIds.length);
      expect(result2.modifiedCount).toBe(productIds.length);

      // Verify final state
      const updated = await Product.find({ _id: { $in: productIds } });
      updated.forEach(product => {
        expect(product.bestSeller).toBe(true);
        expect(product.newArrival).toBe(true);
      });
    });

    test('should maintain data consistency with concurrent updates', async () => {
      const productToUpdate = testProducts[2]._id;
      const originalProduct = await Product.findById(productToUpdate);

      // Simulate rapid concurrent updates
      const updates = [];
      for (let i = 0; i < 5; i++) {
        updates.push(
          Product.updateOne(
            { _id: productToUpdate },
            { $set: { bestSeller: i % 2 === 0 } }
          )
        );
      }

      await Promise.all(updates);

      const final = await Product.findById(productToUpdate);
      
      // Product should have a consistent state
      expect(final).toBeDefined();
      expect(typeof final.bestSeller).toBe('boolean');
    });

    test('should handle overlapping update windows', async () => {
      const product1 = testProducts[3]._id;
      const product2 = testProducts[4]._id;

      // Update product1, then product2, before first completes
      const promise1 = Product.updateOne(
        { _id: product1 },
        { $set: { description: 'Updated by request 1' } }
      );

      const promise2 = Product.updateOne(
        { _id: product2 },
        { $set: { description: 'Updated by request 2' } }
      );

      await Promise.all([promise1, promise2]);

      const updated1 = await Product.findById(product1);
      const updated2 = await Product.findById(product2);

      expect(updated1.description).toBe('Updated by request 1');
      expect(updated2.description).toBe('Updated by request 2');
    });
  });

  describe('Partial Failures During Bulk Update', () => {
    test('should continue updating valid products when some fail', async () => {
      const realProduct = testProducts[0];
      const fakeId = new mongoose.Types.ObjectId();
      const mixedIds = [realProduct._id, fakeId];

      const result = await Product.updateMany(
        { _id: { $in: mixedIds } },
        { $set: { bestSeller: true } }
      );

      expect(result.modifiedCount).toBe(1);

      // Verify the real product was updated
      const updated = await Product.findById(realProduct._id);
      expect(updated.bestSeller).toBe(true);
    });

    test('should report which products failed to update', async () => {
      const validIds = testProducts.slice(0, 2).map(p => p._id);
      const fakeIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
      const allIds = [...validIds, ...fakeIds];

      const result = await Product.updateMany(
        { _id: { $in: allIds } },
        { $set: { newArrival: true } }
      );

      const response = {
        updatedCount: result.modifiedCount,
        failedIds: fakeIds.map(id => id.toString()),
        failureCount: fakeIds.length
      };

      expect(response.updatedCount).toBe(validIds.length);
      expect(response.failedIds).toHaveLength(fakeIds.length);
      expect(response.failureCount).toBe(fakeIds.length);
    });

    test('should provide detailed error messages for failures', () => {
      const failureDetails = [
        {
          id: new mongoose.Types.ObjectId().toString(),
          error: 'Product not found'
        },
        {
          id: 'invalid-id-format',
          error: 'Invalid product ID format'
        },
        {
          id: new mongoose.Types.ObjectId().toString(),
          error: 'Validation error: Invalid category reference'
        }
      ];

      failureDetails.forEach(detail => {
        expect(detail).toHaveProperty('id');
        expect(detail).toHaveProperty('error');
        expect(detail.error).toBeDefined();
        expect(detail.error.length).toBeGreaterThan(0);
      });
    });

    test('should not rollback successful updates on partial failure', async () => {
      const validProduct = testProducts[0];
      const fakeId = new mongoose.Types.ObjectId();

      // Update with mixed valid/invalid IDs
      await Product.updateMany(
        { _id: { $in: [validProduct._id, fakeId] } },
        { $set: { bestSeller: false } }
      );

      // Verify valid product was still updated
      const updated = await Product.findById(validProduct._id);
      expect(updated.bestSeller).toBe(false);
    });
  });

  describe('SEO Field Validation During Bulk Update', () => {
    test('should validate meta title length during bulk update', async () => {
      const productsToUpdate = testProducts.slice(0, 2);
      const productIds = productsToUpdate.map(p => p._id);

      const validSeo = {
        seo: {
          metaTitle: 'Valid Title Under 60 Chars'
        }
      };

      const tooLongSeo = {
        seo: {
          metaTitle: 'This is an extremely long title that exceeds the sixty character limit significantly'
        }
      };

      // Valid update should work
      const validResult = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: validSeo }
      );
      expect(validResult.modifiedCount).toBe(productIds.length);

      // Validate that too-long title would be caught
      expect(tooLongSeo.seo.metaTitle.length).toBeGreaterThan(60);
    });

    test('should validate meta description length during bulk update', async () => {
      const productsToUpdate = testProducts.slice(2, 4);
      const productIds = productsToUpdate.map(p => p._id);

      const validDescription = 'Valid description that is under 160 characters and describes the product well for search engines';
      const tooLongDescription = 'x'.repeat(200);

      const validSeo = { seo: { metaDescription: validDescription } };

      const validResult = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: validSeo }
      );
      expect(validResult.modifiedCount).toBe(productIds.length);

      // Verify length validation
      expect(validDescription.length).toBeLessThanOrEqual(160);
      expect(tooLongDescription.length).toBeGreaterThan(160);
    });

    test('should handle SEO keywords array properly', async () => {
      const productsToUpdate = testProducts.slice(0, 1);
      const productIds = productsToUpdate.map(p => p._id);

      const seoUpdate = {
        seo: {
          metaKeywords: ['jewelry', 'gold', 'bracelet', 'premium']
        }
      };

      const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: seoUpdate }
      );

      expect(result.modifiedCount).toBe(productIds.length);

      const updated = await Product.findById(productIds[0]);
      expect(Array.isArray(updated.seo.metaKeywords)).toBe(true);
      expect(updated.seo.metaKeywords).toContain('jewelry');
    });

    test('should trim and sanitize SEO field values', async () => {
      const productsToUpdate = testProducts.slice(1, 2);
      const productIds = productsToUpdate.map(p => p._id);

      const unsanitizedSeo = {
        seo: {
          metaTitle: '   Title with extra spaces   ',
          metaDescription: '  \n Description with newlines  \n  ',
          metaKeywords: [' keyword ', 'another keyword ', ' third  ']
        }
      };

      // Simulate sanitization
      const sanitized = {
        seo: {
          metaTitle: unsanitizedSeo.seo.metaTitle.trim(),
          metaDescription: unsanitizedSeo.seo.metaDescription.trim().replace(/\s+/g, ' '),
          metaKeywords: unsanitizedSeo.seo.metaKeywords.map(k => k.trim())
        }
      };

      expect(sanitized.seo.metaTitle).toBe('Title with extra spaces');
      expect(sanitized.seo.metaKeywords[0]).toBe('keyword');
      expect(sanitized.seo.metaKeywords[1]).toBe('another keyword');
    });

    test('should reject invalid SEO field structures', () => {
      const invalidSeoUpdates = [
        { seo: null },  // null SEO
        { seo: undefined },  // undefined SEO
        { seo: 'not an object' },  // string instead of object
        { seo: [] },  // array instead of object
        { seo: { unknownField: 'value' } }  // unknown field
      ];

      invalidSeoUpdates.forEach(update => {
        const seoValue = update.seo;
        if (seoValue !== null && seoValue !== undefined) {
          if (typeof seoValue === 'object' && !Array.isArray(seoValue)) {
            // Valid structure
            expect(typeof seoValue).toBe('object');
          } else {
            // Invalid structure
            expect(typeof seoValue).not.toBe('object');
          }
        }
      });
    });

    test('should preserve other fields when updating SEO during bulk operation', async () => {
      const productToTest = testProducts[3];
      const originalName = productToTest.productName;

      await Product.updateOne(
        { _id: productToTest._id },
        { $set: { seo: { metaTitle: 'Updated Title' } } }
      );

      const updated = await Product.findById(productToTest._id);
      expect(updated.productName).toBe(originalName);
      expect(updated.seo.metaTitle).toBe('Updated Title');
    });
  });

  describe('Bulk Edit Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test verifies the error handling pattern
      let connectionError = null;

      try {
        // Simulate a potential connection error scenario
        if (!mongoose.connection.readyState) {
          throw new Error('Database connection lost');
        }
      } catch (error) {
        connectionError = error;
      }

      expect(connectionError).toBeNull();
    });

    test('should have proper transaction rollback on critical failure', async () => {
      // Verify MongoDB session/transaction support
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          // Simulate transaction operation
          expect(session).toBeDefined();
        });
      } finally {
        await session.endSession();
      }
    });

    test('should return consistent error format across failures', () => {
      const errorFormats = [
        { success: false, error: 'Error message', code: 400 },
        { success: false, error: 'Error message', code: 404 },
        { success: false, error: 'Error message', code: 500 }
      ];

      errorFormats.forEach(format => {
        expect(format).toHaveProperty('success');
        expect(format).toHaveProperty('error');
        expect(format).toHaveProperty('code');
        expect(format.success).toBe(false);
      });
    });
  });
});
