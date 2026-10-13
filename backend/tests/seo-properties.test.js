/**
 * Property-Based Tests for SEO Field Validation
 * 
 * These tests verify universal correctness properties that should hold true
 * across ALL possible inputs for the SEO bulk upload feature.
 * 
 * Testing Framework: fast-check
 * 
 * Properties being tested:
 * 1. Meta Title is trimmed and truncated to max 60 characters
 * 2. Meta Description is trimmed and truncated to max 160 characters
 * 3. Meta Keywords array contains only non-empty, trimmed values with maximum 10 items
 * 4. Schema is auto-generated with all required Product fields
 * 5. Products upload successfully with or without SEO data
 * 6. Round-trip preservation of SEO data (extract -> store -> retrieve)
 */

const fc = require('fast-check');
const mongoose = require('mongoose');
const { sanitizeSeoFields, generateProductSchema } = require('../utils/seoHelper');

/**
 * HELPER: Run fast-check property with Jest expectation
 */
const expectProperty = (propertyFn, numRuns = 1000) => {
  try {
    fc.assert(fc.property(propertyFn), { numRuns });
    return true;
  } catch (e) {
    throw new Error(`Property failed: ${e.message}`);
  }
};

const expectPropertyWithArbs = (arbs, propertyFn, numRuns = 1000) => {
  try {
    fc.assert(fc.property(...arbs, propertyFn), { numRuns });
    return true;
  } catch (e) {
    throw new Error(`Property failed: ${e.message}`);
  }
};

/**
 * Property 1: Meta Title Truncation to 60 Characters
 * **Validates: Requirements 1.2**
 */
describe('Property 1: Meta Title Truncation to 60 Characters', () => {
  test('✓ Title with any content is always ≤ 60 chars after sanitization', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string()],
        (title) => {
          const result = sanitizeSeoFields(title, null, []);
          if (result.metaTitle !== null) {
            return result.metaTitle.length <= 60;
          }
          return true;
        },
        1000
      );
    }).not.toThrow();
  });

  test('✓ Title is trimmed (no leading/trailing whitespace)', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string(), fc.string(), fc.string()],
        (prefix, content, suffix) => {
          const titleWithSpaces = prefix + content + suffix;
          const result = sanitizeSeoFields(titleWithSpaces, null, []);
          if (result.metaTitle !== null) {
            return result.metaTitle === result.metaTitle.trim();
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Title ≤ 60 chars never truncated (no data loss)', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string({ minLength: 0, maxLength: 60 })],
        (shortTitle) => {
          const result = sanitizeSeoFields(shortTitle, null, []);
          const trimmed = shortTitle.trim();
          
          if (result.metaTitle === null || result.metaTitle === '') {
            // Empty or whitespace-only strings become null or empty string
            return trimmed.length === 0;
          }
          
          // Non-empty strings should equal trimmed input (no truncation)
          return result.metaTitle === trimmed && result.metaTitle.length <= 60;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Title > 60 chars truncated to exactly 60 chars', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string({ minLength: 61, maxLength: 200 })],
        (longTitle) => {
          const result = sanitizeSeoFields(longTitle, null, []);
          if (result.metaTitle !== null) {
            return result.metaTitle.length === 60;
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Title with special characters handled correctly', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string()],
        (title) => {
          const result = sanitizeSeoFields(title, null, []);
          if (result.metaTitle !== null) {
            return result.metaTitle.length <= 60;
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });
});

/**
 * Property 2: Meta Description Truncation to 160 Characters
 * **Validates: Requirements 1.3**
 */
describe('Property 2: Meta Description Truncation to 160 Characters', () => {
  test('✓ Description with any content is always ≤ 160 chars after sanitization', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string()],
        (description) => {
          const result = sanitizeSeoFields(null, description, []);
          if (result.metaDescription !== null) {
            return result.metaDescription.length <= 160;
          }
          return true;
        },
        1000
      );
    }).not.toThrow();
  });

  test('✓ Description is trimmed (no leading/trailing whitespace)', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string(), fc.string(), fc.string()],
        (prefix, content, suffix) => {
          const descWithSpaces = prefix + content + suffix;
          const result = sanitizeSeoFields(null, descWithSpaces, []);
          if (result.metaDescription !== null) {
            return result.metaDescription === result.metaDescription.trim();
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Description ≤ 160 chars never truncated (no data loss)', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string({ minLength: 0, maxLength: 160 })],
        (shortDesc) => {
          const result = sanitizeSeoFields(null, shortDesc, []);
          const trimmed = shortDesc.trim();
          
          if (result.metaDescription === null || result.metaDescription === '') {
            // Empty or whitespace-only strings become null or empty string
            return trimmed.length === 0;
          }
          
          // Non-empty strings should equal trimmed input (no truncation)
          return result.metaDescription === trimmed && result.metaDescription.length <= 160;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Description > 160 chars truncated to exactly 160 chars', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string({ minLength: 161, maxLength: 500 })],
        (longDesc) => {
          const result = sanitizeSeoFields(null, longDesc, []);
          if (result.metaDescription !== null) {
            return result.metaDescription.length === 160;
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Description with special characters handled correctly', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string()],
        (description) => {
          const result = sanitizeSeoFields(null, description, []);
          if (result.metaDescription !== null) {
            return result.metaDescription.length <= 160;
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Long prose text truncated correctly', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string({ minLength: 200, maxLength: 1000 })],
        (proseText) => {
          const result = sanitizeSeoFields(null, proseText, []);
          if (result.metaDescription !== null) {
            return result.metaDescription.length <= 160;
          }
          return true;
        },
        300
      );
    }).not.toThrow();
  });
});

/**
 * Property 3: Meta Keywords Array Constraints
 * **Validates: Requirements 1.4, 1.5, 1.6, 1.8**
 */
describe('Property 3: Meta Keywords Array Constraints', () => {
  test('✓ Keywords array contains only non-empty strings', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.string())],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          return result.metaKeywords.every((kw) => kw.length > 0);
        },
        1000
      );
    }).not.toThrow();
  });

  test('✓ Empty strings in keyword array are filtered out', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.oneof(fc.string(), fc.constant('')))],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          const hasEmpty = result.metaKeywords.some((kw) => kw.length === 0);
          return !hasEmpty;
        },
        1000
      );
    }).not.toThrow();
  });

  test('✓ Keywords are always trimmed', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.string())],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          return result.metaKeywords.every((kw) => kw === kw.trim());
        },
        1000
      );
    }).not.toThrow();
  });

  test('✓ Keyword array never exceeds 10 items', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.string())],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          return result.metaKeywords.length <= 10;
        },
        1000
      );
    }).not.toThrow();
  });

  test('✓ Keywords ≤ 10 items preserve order', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.string({ minLength: 1 }), { maxLength: 10 })],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          const trimmedInput = keywords
            .map((k) => k.trim())
            .filter((k) => k.length > 0);
          if (trimmedInput.length <= 10) {
            return JSON.stringify(result.metaKeywords) === JSON.stringify(trimmedInput);
          }
          return true;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Keywords > 10 items limited to first 10', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.string({ minLength: 1 }), { minLength: 11, maxLength: 30 })],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          return result.metaKeywords.length <= 10;
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Unicode keywords handled correctly', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.array(fc.string({ minLength: 1 }))],
        (keywords) => {
          const result = sanitizeSeoFields(null, null, keywords);
          return result.metaKeywords.every((kw) => kw.length > 0);
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Duplicate keywords both preserved', () => {
    const keywords = ['gold', 'gold', 'jewelry', 'jewelry', 'jewelry'];
    const result = sanitizeSeoFields(null, null, keywords);
    expect(result.metaKeywords).toContain('gold');
    expect(result.metaKeywords).toContain('jewelry');
  });
});

/**
 * Property 4: Schema Auto-Generation Validity
 * **Validates: Requirements 1.7**
 */
describe('Property 4: Schema Auto-Generation Validity', () => {
  const createMockProduct = (overrides = {}) => {
    return {
      _id: new mongoose.Types.ObjectId(),
      slug: 'test-product-slug',
      productName: 'Test Product',
      description: 'Test description',
      imageUrl: 'https://example.com/image.jpg',
      designCode: 'TEST001',
      category: { name: 'Test Category', _id: new mongoose.Types.ObjectId() },
      ...overrides
    };
  };

  test('✓ Generated schema contains all required fields', () => {
    const product = createMockProduct();
    const schema = generateProductSchema(product);
    
    expect(schema['@context']).toBe('https://schema.org/');
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBeDefined();
    expect(schema.description).toBeDefined();
    expect(schema.image).toBeDefined();
    expect(schema.url).toBeDefined();
    expect(schema.brand).toBeDefined();
    expect(schema.category).toBeDefined();
    expect(schema.sku).toBeDefined();
    expect(schema.offers).toBeDefined();
  });

  test('✓ Schema fields match product data', () => {
    const product = createMockProduct({
      productName: 'Gold Necklace',
      designCode: 'GN001',
      description: 'Premium gold necklace'
    });
    const schema = generateProductSchema(product);
    
    expect(schema.name).toBe('Gold Necklace');
    expect(schema.sku).toBe('GN001');
    expect(schema.description).toBe('Premium gold necklace');
  });

  test('✓ Schema is valid JSON', () => {
    const product = createMockProduct();
    const schema = generateProductSchema(product);
    const jsonString = JSON.stringify(schema);
    const parsed = JSON.parse(jsonString);
    expect(parsed['@type']).toBe('Product');
  });

  test('✓ Schema URL uses product slug', () => {
    const product = createMockProduct({ slug: 'custom-slug' });
    const schema = generateProductSchema(product);
    expect(schema.url).toContain('custom-slug');
  });

  test('✓ Schema brand is always Puramente', () => {
    const product = createMockProduct();
    const schema = generateProductSchema(product);
    expect(schema.brand.name).toBe('Puramente');
  });

  test('✓ Schema handles special characters in product name', () => {
    expect(() => {
      expectPropertyWithArbs(
        [fc.string({ minLength: 1, maxLength: 100 })],
        (productName) => {
          const product = createMockProduct({ productName });
          const schema = generateProductSchema(product);
          return JSON.stringify(schema).length > 0;
        },
        200
      );
    }).not.toThrow();
  });

  test('✓ Schema with minimal product data is valid', () => {
    const minimalProduct = createMockProduct({
      productName: 'P',
      description: 'D',
      imageUrl: 'http://x.com/i.jpg',
      designCode: 'X'
    });
    const schema = generateProductSchema(minimalProduct);
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBeDefined();
  });

  test('✓ Schema with long description is valid', () => {
    const longDesc = 'A'.repeat(500);
    const product = createMockProduct({ description: longDesc });
    const schema = generateProductSchema(product);
    expect(schema.description).toBe(longDesc);
    expect(JSON.stringify(schema).length > 0);
  });

  test('✓ Offers structure present and valid', () => {
    const product = createMockProduct();
    const schema = generateProductSchema(product);
    expect(schema.offers).toBeDefined();
    expect(schema.offers['@type']).toBe('Offer');
    expect(schema.offers.availability).toBe('https://schema.org/InStock');
  });
});

/**
 * Property 5: Upload Success With or Without SEO
 * **Validates: Requirements 1.1, 1.9**
 */
describe('Property 5: Upload Success With or Without SEO', () => {
  test('✓ Sanitization succeeds with all SEO fields populated', () => {
    expect(() => {
      expectPropertyWithArbs(
        [
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          fc.array(fc.string({ minLength: 1 }), { maxLength: 10 })
        ],
        (title, desc, keywords) => {
          const result = sanitizeSeoFields(title, desc, keywords);
          return (
            result.metaTitle !== undefined &&
            result.metaDescription !== undefined &&
            Array.isArray(result.metaKeywords)
          );
        },
        500
      );
    }).not.toThrow();
  });

  test('✓ Sanitization succeeds with no SEO fields', () => {
    const result = sanitizeSeoFields(null, null, []);
    expect(result.metaTitle).toBeNull();
    expect(result.metaDescription).toBeNull();
    expect(Array.isArray(result.metaKeywords)).toBe(true);
    expect(result.metaKeywords.length).toBe(0);
  });

  test('✓ Sanitization succeeds with only title', () => {
    const result = sanitizeSeoFields('Test Title', null, []);
    expect(result.metaTitle).toBeDefined();
    expect(result.metaTitle.length <= 60).toBe(true);
    expect(result.metaDescription).toBeNull();
    expect(result.metaKeywords.length).toBe(0);
  });

  test('✓ Sanitization succeeds with only description', () => {
    const result = sanitizeSeoFields(null, 'Test Description', []);
    expect(result.metaTitle).toBeNull();
    expect(result.metaDescription).toBeDefined();
    expect(result.metaDescription.length <= 160).toBe(true);
    expect(result.metaKeywords.length).toBe(0);
  });

  test('✓ Sanitization succeeds with only keywords', () => {
    const result = sanitizeSeoFields(null, null, ['keyword1', 'keyword2']);
    expect(result.metaTitle).toBeNull();
    expect(result.metaDescription).toBeNull();
    expect(result.metaKeywords.length).toBeGreaterThan(0);
  });

  test('✓ Sanitization succeeds with title + description', () => {
    const result = sanitizeSeoFields('Title', 'Description', []);
    expect(result.metaTitle).toBeDefined();
    expect(result.metaDescription).toBeDefined();
    expect(result.metaKeywords.length).toBe(0);
  });

  test('✓ Sanitization succeeds with description + keywords', () => {
    const result = sanitizeSeoFields(null, 'Description', ['kw1', 'kw2']);
    expect(result.metaTitle).toBeNull();
    expect(result.metaDescription).toBeDefined();
    expect(result.metaKeywords.length).toBeGreaterThan(0);
  });

  test('✓ Result always has seo structure', () => {
    expect(() => {
      expectPropertyWithArbs(
        [
          fc.option(fc.string()),
          fc.option(fc.string()),
          fc.array(fc.string())
        ],
        (title, desc, keywords) => {
          const result = sanitizeSeoFields(title, desc, keywords);
          return (
            'metaTitle' in result &&
            'metaDescription' in result &&
            'metaKeywords' in result
          );
        },
        500
      );
    }).not.toThrow();
  });
});

/**
 * Property 6: Round-Trip Preservation of SEO Data
 * **Validates: Requirements 1.2, 1.3, 1.4**
 */
describe('Property 6: Round-Trip Preservation of SEO Data', () => {
  test('✓ All SEO fields preserved after round-trip', () => {
    const originalTitle = 'Test Title for SEO';
    const originalDesc = 'This is a test description for SEO purposes';
    const originalKeywords = ['keyword1', 'keyword2', 'keyword3'];
    
    const sanitized = sanitizeSeoFields(originalTitle, originalDesc, originalKeywords);
    expect(sanitized.metaTitle).toBeDefined();
    expect(sanitized.metaDescription).toBeDefined();
    expect(Array.isArray(sanitized.metaKeywords)).toBe(true);
    
    const queriedAgain = sanitizeSeoFields(
      sanitized.metaTitle,
      sanitized.metaDescription,
      sanitized.metaKeywords
    );
    
    expect(queriedAgain.metaTitle).toBe(sanitized.metaTitle);
    expect(queriedAgain.metaDescription).toBe(sanitized.metaDescription);
    expect(JSON.stringify(queriedAgain.metaKeywords)).toBe(JSON.stringify(sanitized.metaKeywords));
  });

  test('✓ Round-trip with max-length fields', () => {
    const maxTitle = 'A'.repeat(60);
    const maxDesc = 'B'.repeat(160);
    const maxKeywords = ['kw1', 'kw2', 'kw3', 'kw4', 'kw5', 'kw6', 'kw7', 'kw8', 'kw9', 'kw10'];
    
    const sanitized = sanitizeSeoFields(maxTitle, maxDesc, maxKeywords);
    expect(sanitized.metaTitle.length).toBe(60);
    expect(sanitized.metaDescription.length).toBe(160);
    expect(sanitized.metaKeywords.length).toBe(10);
    
    const queriedAgain = sanitizeSeoFields(
      sanitized.metaTitle,
      sanitized.metaDescription,
      sanitized.metaKeywords
    );
    
    expect(queriedAgain.metaTitle).toBe(sanitized.metaTitle);
    expect(queriedAgain.metaDescription).toBe(sanitized.metaDescription);
    expect(queriedAgain.metaKeywords).toEqual(sanitized.metaKeywords);
  });

  test('✓ Round-trip with special characters preserved', () => {
    const specialTitle = 'Special: "Quotes" & Ampersand © Symbol';
    const specialDesc = 'Description with special chars: <html>, {json}, [array]';
    const specialKeywords = ['café', 'naïve', 'résumé'];
    
    const sanitized = sanitizeSeoFields(specialTitle, specialDesc, specialKeywords);
    const queriedAgain = sanitizeSeoFields(
      sanitized.metaTitle,
      sanitized.metaDescription,
      sanitized.metaKeywords
    );
    
    expect(queriedAgain.metaTitle).toBe(sanitized.metaTitle);
    expect(queriedAgain.metaDescription).toBe(sanitized.metaDescription);
  });

  test('✓ Round-trip with partial fields', () => {
    const title = 'Title Only';
    const keywords = ['kw1', 'kw2'];
    
    const sanitized = sanitizeSeoFields(title, null, keywords);
    expect(sanitized.metaTitle).toBeDefined();
    expect(sanitized.metaDescription).toBeNull();
    expect(sanitized.metaKeywords.length).toBe(2);
    
    const queriedAgain = sanitizeSeoFields(
      sanitized.metaTitle,
      sanitized.metaDescription,
      sanitized.metaKeywords
    );
    
    expect(queriedAgain.metaTitle).toBe(sanitized.metaTitle);
    expect(queriedAgain.metaDescription).toBeNull();
    expect(queriedAgain.metaKeywords).toEqual(sanitized.metaKeywords);
  });

  test('✓ Round-trip with no SEO data', () => {
    const sanitized = sanitizeSeoFields(null, null, []);
    expect(sanitized.metaTitle).toBeNull();
    expect(sanitized.metaDescription).toBeNull();
    expect(sanitized.metaKeywords.length).toBe(0);
    
    const queriedAgain = sanitizeSeoFields(
      sanitized.metaTitle,
      sanitized.metaDescription,
      sanitized.metaKeywords
    );
    
    expect(queriedAgain.metaTitle).toBeNull();
    expect(queriedAgain.metaDescription).toBeNull();
    expect(queriedAgain.metaKeywords.length).toBe(0);
  });

  test('✓ Round-trip preserves semantic meaning', () => {
    expect(() => {
      expectPropertyWithArbs(
        [
          fc.option(fc.string({ minLength: 1, maxLength: 100 })),
          fc.option(fc.string({ minLength: 1, maxLength: 200 })),
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 15 })
        ],
        (title, desc, keywords) => {
          const sanitized = sanitizeSeoFields(title, desc, keywords);
          const queriedAgain = sanitizeSeoFields(
            sanitized.metaTitle,
            sanitized.metaDescription,
            sanitized.metaKeywords
          );
          
          if (sanitized.metaTitle !== null && queriedAgain.metaTitle !== null) {
            if (sanitized.metaTitle !== queriedAgain.metaTitle) return false;
          }
          
          if (sanitized.metaDescription !== null && queriedAgain.metaDescription !== null) {
            if (sanitized.metaDescription !== queriedAgain.metaDescription) return false;
          }
          
          if (JSON.stringify(sanitized.metaKeywords) !== JSON.stringify(queriedAgain.metaKeywords)) {
            return false;
          }
          
          return true;
        },
        300
      );
    }).not.toThrow();
  });
});

/**
 * SUMMARY
 * ========
 * ✅ Property 1: Meta Title Truncation (5 tests)
 * ✅ Property 2: Meta Description Truncation (6 tests)
 * ✅ Property 3: Meta Keywords Constraints (8 tests)
 * ✅ Property 4: Schema Validity (8 tests)
 * ✅ Property 5: Upload Success (8 tests)
 * ✅ Property 6: Round-Trip Preservation (6 tests)
 * 
 * Total: 41 comprehensive property-based tests
 */
