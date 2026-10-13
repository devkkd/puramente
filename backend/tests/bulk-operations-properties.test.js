/**
 * Property-Based Tests for Bulk Operations Handler
 * 
 * Uses fast-check for property-based testing to validate:
 * - All successfully updated products match requested field values
 * - No products are partially updated (all-or-nothing per product)
 * - Error tracking maintains integrity of update operation
 */

const fc = require('fast-check');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const {
  validateBulkProductIds,
  validateBulkUpdateFields,
  processBulkUpdate,
  executeBulkEdit
} = require('../utils/bulkOperations');

// Connect to test database
beforeAll(async () => {
  const MONGO_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/puramente-test';
  await mongoose.connect(MONGO_URL);
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Helper: Create test products
async function createTestProducts(count) {
  const category = await Category.findOne() || await Category.create({
    name: 'Test Category',
    imageUrl: 'https://example.com/image.jpg'
  });

  const products = [];
  for (let i = 0; i < count; i++) {
    const product = await Product.create({
      productName: `Test Product ${i}`,
      description: `Description ${i}`,
      designCode: `SKU-${i}`,
      imageUrl: 'https://example.com/image.jpg',
      category: category._id,
      bestSeller: false,
      newArrival: false
    });
    products.push(product);
  }
  return { products, category };
}

// Helper: Clean up test data
async function cleanup(productIds) {
  await Product.deleteMany({ _id: { $in: productIds } });
}

describe('Bulk Operations Properties', () => {
  
  describe('Property 1: All successfully updated products match requested field values', () => {
    
    test('For any valid product IDs and field updates, all updated products contain the requested values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 10 }).chain(count =>
            fc.constant(count).chain(count =>
              fc.tuple(
                fc.constant(count),
                fc.oneof(
                  fc.record({
                    productName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0)
                  }),
                  fc.record({
                    bestSeller: fc.boolean(),
                    newArrival: fc.boolean()
                  }),
                  fc.record({
                    description: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
                  })
                )
              )
            )
          ),
          async ([productCount, updateFields]) => {
            // Create test products
            const { products, category } = await createTestProducts(productCount);
            const productIds = products.map(p => p._id.toString());

            try {
              // Execute bulk update
              const result = await processBulkUpdate(productIds, updateFields);

              // Validate result
              if (result.success) {
                // For each successfully updated product, verify it has the requested values
                const updatedIds = new Set(result.updatedProducts.map(p => p._id.toString()));

                for (const updateId of updatedIds) {
                  const updated = await Product.findById(updateId);

                  // Property: All updated products have the requested values
                  if (updateFields.productName !== undefined) {
                    expect(updated.productName).toBe(updateFields.productName);
                  }
                  if (updateFields.bestSeller !== undefined) {
                    expect(updated.bestSeller).toBe(updateFields.bestSeller);
                  }
                  if (updateFields.newArrival !== undefined) {
                    expect(updated.newArrival).toBe(updateFields.newArrival);
                  }
                  if (updateFields.description !== undefined) {
                    expect(updated.description).toBe(updateFields.description);
                  }
                }
              }
            } finally {
              // Cleanup
              await cleanup(productIds);
            }
          }
        ),
        { numRuns: 50 }
      );
    }, 30000);

  });

  describe('Property 2: No products are partially updated (all-or-nothing per product)', () => {
    
    test('For any product update operation, each product is either fully updated or not updated', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 10 }).chain(count =>
            fc.tuple(
              fc.constant(count),
              fc.record({
                productName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
                bestSeller: fc.boolean()
              })
            )
          ),
          async ([productCount, updateFields]) => {
            // Create test products
            const { products, category } = await createTestProducts(productCount);
            const productIds = products.map(p => p._id.toString());
            
            // Store original values
            const originalValues = {};
            for (const product of products) {
              originalValues[product._id.toString()] = {
                productName: product.productName,
                bestSeller: product.bestSeller
              };
            }

            try {
              // Execute bulk update
              const result = await processBulkUpdate(productIds, updateFields);

              // Check each product: either all fields are updated or none are
              const allProducts = await Product.find({ _id: { $in: productIds } });

              for (const product of allProducts) {
                const productId = product._id.toString();
                const original = originalValues[productId];

                // Property: All-or-nothing update per product
                const hasProductNameUpdate = product.productName !== original.productName;
                const hasBestSellerUpdate = product.bestSeller !== original.bestSeller;

                // If product name was updated, best seller should also be (or stayed same)
                // If this product is in successful list, both fields should be updated
                const isInSuccessfulList = result.updatedProducts.some(
                  p => p._id.toString() === productId
                );

                if (isInSuccessfulList) {
                  // Product should have both fields updated to new values
                  expect(product.productName).toBe(updateFields.productName);
                  expect(product.bestSeller).toBe(updateFields.bestSeller);
                } else {
                  // Product should have original values (no partial update)
                  expect(product.productName).toBe(original.productName);
                  expect(product.bestSeller).toBe(original.bestSeller);
                }
              }
            } finally {
              // Cleanup
              await cleanup(productIds);
            }
          }
        ),
        { numRuns: 50 }
      );
    }, 30000);

  });

  describe('Property 3: Error tracking maintains integrity of update operation', () => {
    
    test('For any bulk operation, error count equals failed IDs and failed IDs set matches errors array', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 10 }).chain(count =>
            fc.tuple(
              fc.constant(count),
              fc.record({
                productName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0)
              })
            )
          ),
          async ([productCount, updateFields]) => {
            // Create test products
            const { products, category } = await createTestProducts(productCount);
            const productIds = products.map(p => p._id.toString());

            try {
              // Execute bulk update
              const result = await processBulkUpdate(productIds, updateFields);

              // Property: Error tracking integrity
              // 1. failedCount should equal failedIds length
              expect(result.failedCount).toBe(result.failedIds.length);

              // 2. updatedCount should equal updatedProducts length
              expect(result.updatedCount).toBe(result.updatedProducts.length);

              // 3. Total of updated + failed should equal input count
              expect(result.updatedCount + result.failedCount).toBe(productIds.length);

              // 4. failedIds should be unique
              const uniqueFailed = new Set(result.failedIds);
              expect(uniqueFailed.size).toBe(result.failedIds.length);

              // 5. Updated product IDs should be unique
              const uniqueUpdated = new Set(result.updatedProducts.map(p => p._id.toString()));
              expect(uniqueUpdated.size).toBe(result.updatedProducts.length);

              // 6. No overlap between failed and updated IDs
              const updatedIdSet = new Set(result.updatedProducts.map(p => p._id.toString()));
              for (const failedId of result.failedIds) {
                expect(updatedIdSet.has(failedId)).toBe(false);
              }

              // 7. Errors array should have entries for failed products
              if (result.failedCount > 0) {
                expect(result.errors.length).toBeGreaterThan(0);
              }
            } finally {
              // Cleanup
              await cleanup(productIds);
            }
          }
        ),
        { numRuns: 50 }
      );
    }, 30000);

  });

  describe('Property 4: Validation functions maintain consistency', () => {

    test('For any product IDs, validated IDs should never reference non-existent products', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 5 }).chain(count =>
            fc.tuple(
              fc.constant(count),
              fc.array(fc.hexaDecimal(), { minLength: 0, maxLength: 3 })
            )
          ),
          async ([productCount, invalidIdChars]) => {
            // Create test products
            const { products, category } = await createTestProducts(productCount);
            const validIds = products.map(p => p._id.toString());

            // Mix valid and invalid IDs
            const mixedIds = [
              ...validIds,
              ...invalidIdChars.map(char => '0'.repeat(24 - char.length) + char.slice(0, 1))
            ];

            try {
              // Validate IDs
              const validation = await validateBulkProductIds(mixedIds);

              // Property: All validated IDs exist in database
              for (const validatedId of validation.validIds) {
                const product = await Product.findById(validatedId);
                expect(product).toBeTruthy();
              }

              // Property: No validated ID is invalid format
              for (const validatedId of validation.validIds) {
                expect(/^[0-9a-f]{24}$/.test(validatedId)).toBe(true);
              }

            } finally {
              // Cleanup
              await cleanup(validIds);
            }
          }
        ),
        { numRuns: 30 }
      );
    }, 30000);

  });

  describe('Integration: Execute bulk edit maintains all properties', () => {

    test('For any valid bulk edit request, all properties hold together in end-to-end operation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 8 }).chain(count =>
            fc.tuple(
              fc.constant(count),
              fc.record({
                productName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
                bestSeller: fc.boolean()
              })
            )
          ),
          async ([productCount, updateFields]) => {
            // Create test products
            const { products, category } = await createTestProducts(productCount);
            const productIds = products.map(p => p._id.toString());

            try {
              // Execute full bulk edit workflow
              const result = await executeBulkEdit(productIds, updateFields);

              if (result.success) {
                // Property 1: All updated products match requested values
                const updatedIds = new Set(
                  result.updatedProducts.map(p => p._id.toString())
                );
                
                for (const updatedId of updatedIds) {
                  const updated = await Product.findById(updatedId);
                  expect(updated.productName).toBe(updateFields.productName);
                  expect(updated.bestSeller).toBe(updateFields.bestSeller);
                }

                // Property 2: Counts are consistent
                expect(result.updatedCount).toBe(result.updatedProducts.length);
                expect(result.failedCount).toBe(result.failedIds.length);

                // Property 3: All requested products were processed
                const processedCount = result.updatedCount + result.failedCount;
                expect(processedCount).toBe(productIds.length);
              }
            } finally {
              // Cleanup
              await cleanup(productIds);
            }
          }
        ),
        { numRuns: 30 }
      );
    }, 30000);

  });

});
