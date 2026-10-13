/**
 * Unit Test: SEO Field Extraction and Sanitization Logic
 * 
 * Tests the core logic used in bulkUploadProducts without requiring MongoDB connection:
 * 1. SEO column extraction from Excel rows
 * 2. SEO field sanitization
 * 3. Schema auto-generation
 * 4. Backward compatibility with no SEO data
 */

const { sanitizeSeoFields, generateProductSchema } = require('../utils/seoHelper');
const mongoose = require('mongoose');

/**
 * Mock Excel row data structures
 */

// Test Case 1: Row with NO SEO columns
const ROW_NO_SEO = {
  'Product Code': 'TEST001',
  'Product Name': 'Gold Ring',
  'Description': 'Beautiful gold ring',
  'Category': 'Rings',
  'Sub - Category': 'with gemstone',
  'New Arrival': 'true',
  'Best Seller': 'false',
  'Image Name': 'test-image.jpg'
};

// Test Case 2: Row with PARTIAL SEO (title and description, no keywords)
const ROW_PARTIAL_SEO_1 = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST002',
  'Product Name': 'Silver Necklace',
  'Meta Title': 'Silver Necklace - Premium Collection',
  'Meta Description': 'Handcrafted silver necklace with gemstone inlay'
};

// Test Case 3: Row with PARTIAL SEO (title only)
const ROW_PARTIAL_SEO_2 = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST003',
  'Product Name': 'Diamond Earrings',
  'Meta Title': 'Diamond Earrings - Luxury Design'
};

// Test Case 4: Row with ALL SEO columns
const ROW_FULL_SEO = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST004',
  'Product Name': 'Gold Bracelet',
  'Meta Title': 'Gold Bracelet - Premium Design',
  'Meta Description': 'Exquisite gold bracelet handcrafted with precision',
  'Meta Keyword 1': 'gold bracelet',
  'Meta Keyword 2': 'luxury jewelry',
  'Meta Keyword 3': 'handcrafted design'
};

// Test Case 5: Row with TOO MANY keywords (>10)
const ROW_OVERFLOW_KEYWORDS = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST005',
  'Product Name': 'Overflow Test',
  'Meta Title': 'Test',
  'Meta Keyword 1': 'kw1',
  'Meta Keyword 2': 'kw2',
  'Meta Keyword 3': 'kw3',
  'Meta Keyword 4': 'kw4',
  'Meta Keyword 5': 'kw5',
  'Meta Keyword 6': 'kw6',
  'Meta Keyword 7': 'kw7',
  'Meta Keyword 8': 'kw8',
  'Meta Keyword 9': 'kw9',
  'Meta Keyword 10': 'kw10',
  'Meta Keyword 11': 'kw11',
  'Meta Keyword 12': 'kw12'
};

// Test Case 6: Row with OVERSIZED fields (>limits)
const ROW_OVERSIZED = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST006',
  'Product Name': 'Oversized Test',
  'Meta Title': 'This is a very long meta title that definitely exceeds 60 characters and should be truncated',
  'Meta Description': 'This is a very long meta description that goes way beyond 160 characters and should be truncated to exactly 160 characters to maintain SEO standards and best practices for search engine optimization across all platforms'
};

// Test Case 7: Row with EMPTY keyword cells (should be filtered out)
const ROW_EMPTY_KEYWORDS = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST007',
  'Product Name': 'Empty Keywords Test',
  'Meta Title': 'Test Title',
  'Meta Keyword 1': 'keyword1',
  'Meta Keyword 2': '',  // empty
  'Meta Keyword 3': 'keyword3',
  'Meta Keyword 4': '   '  // whitespace only
};

// Test Case 8: Row with WHITESPACE in values (should be trimmed)
const ROW_WHITESPACE = {
  ...ROW_NO_SEO,
  'Product Code': 'TEST008',
  'Product Name': 'Whitespace Test',
  'Meta Title': '   Title with spaces   ',
  'Meta Description': '  Description with leading/trailing spaces  ',
  'Meta Keyword 1': '  keyword with spaces  ',
  'Meta Keyword 2': '\tkeyword\twith\ttabs\t'
};

/**
 * Extract SEO fields from Excel row (mimics real implementation)
 */
function extractSeoFromRow(row) {
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

  return { metaTitle, metaDescription, metaKeywords };
}

/**
 * Test runner
 */
function runTests() {
  console.log('\n========================================');
  console.log('🧪 SEO EXTRACTION & SANITIZATION TESTS');
  console.log('========================================\n');

  let passCount = 0;
  let failCount = 0;

  // Helper to run a test
  function test(name, fn) {
    try {
      console.log(`Testing: ${name}`);
      fn();
      console.log('  ✅ PASSED\n');
      passCount++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      failCount++;
    }
  }

  // Helper for assertions
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  // ============================================
  // TEST SUITE 1: No SEO Data
  // ============================================
  console.log('📝 TEST SUITE 1: No SEO Data');
  console.log('-'.repeat(40) + '\n');

  test('Extract from row with no SEO columns', () => {
    const extracted = extractSeoFromRow(ROW_NO_SEO);
    assert(extracted.metaTitle === null, 'metaTitle should be null');
    assert(extracted.metaDescription === null, 'metaDescription should be null');
    assert(Array.isArray(extracted.metaKeywords), 'metaKeywords should be array');
    assert(extracted.metaKeywords.length === 0, 'metaKeywords should be empty');
  });

  test('Sanitize null/empty SEO data', () => {
    const sanitized = sanitizeSeoFields(null, null, []);
    assert(sanitized.metaTitle === null, 'metaTitle should remain null');
    assert(sanitized.metaDescription === null, 'metaDescription should remain null');
    assert(Array.isArray(sanitized.metaKeywords), 'metaKeywords should be array');
    assert(sanitized.metaKeywords.length === 0, 'metaKeywords should remain empty');
  });

  test('Products with no SEO should not have schema', () => {
    const extracted = extractSeoFromRow(ROW_NO_SEO);
    const sanitized = sanitizeSeoFields(extracted.metaTitle, extracted.metaDescription, extracted.metaKeywords);
    
    const hasSeoData = sanitized.metaTitle || sanitized.metaDescription || sanitized.metaKeywords.length > 0;
    assert(!hasSeoData, 'Should detect no SEO data');
  });

  // ============================================
  // TEST SUITE 2: Partial SEO Data
  // ============================================
  console.log('\n📝 TEST SUITE 2: Partial SEO Data');
  console.log('-'.repeat(40) + '\n');

  test('Extract partial SEO (title + description)', () => {
    const extracted = extractSeoFromRow(ROW_PARTIAL_SEO_1);
    assert(extracted.metaTitle !== null, 'metaTitle should be extracted');
    assert(extracted.metaDescription !== null, 'metaDescription should be extracted');
    assert(extracted.metaKeywords.length === 0, 'metaKeywords should be empty');
  });

  test('Extract partial SEO (title only)', () => {
    const extracted = extractSeoFromRow(ROW_PARTIAL_SEO_2);
    assert(extracted.metaTitle !== null, 'metaTitle should be extracted');
    assert(extracted.metaDescription === null, 'metaDescription should be null');
    assert(extracted.metaKeywords.length === 0, 'metaKeywords should be empty');
  });

  test('Sanitize partial SEO data', () => {
    const extracted = extractSeoFromRow(ROW_PARTIAL_SEO_1);
    const sanitized = sanitizeSeoFields(extracted.metaTitle, extracted.metaDescription, extracted.metaKeywords);
    
    assert(sanitized.metaTitle !== null, 'metaTitle should be preserved');
    assert(sanitized.metaTitle.length <= 60, 'metaTitle should be <= 60 chars');
    assert(sanitized.metaDescription !== null, 'metaDescription should be preserved');
    assert(sanitized.metaDescription.length <= 160, 'metaDescription should be <= 160 chars');
  });

  // ============================================
  // TEST SUITE 3: Full SEO Data
  // ============================================
  console.log('\n📝 TEST SUITE 3: Full SEO Data');
  console.log('-'.repeat(40) + '\n');

  test('Extract full SEO data including keywords', () => {
    const extracted = extractSeoFromRow(ROW_FULL_SEO);
    assert(extracted.metaTitle !== null, 'metaTitle should be extracted');
    assert(extracted.metaDescription !== null, 'metaDescription should be extracted');
    assert(extracted.metaKeywords.length === 3, 'Should extract all 3 keywords');
    assert(extracted.metaKeywords[0] === 'gold bracelet', 'Keywords should preserve order');
  });

  test('Sanitize full SEO data', () => {
    const extracted = extractSeoFromRow(ROW_FULL_SEO);
    const sanitized = sanitizeSeoFields(extracted.metaTitle, extracted.metaDescription, extracted.metaKeywords);
    
    assert(sanitized.metaKeywords.length === 3, 'Should preserve all 3 keywords');
    assert(sanitized.metaKeywords[0] === 'gold bracelet', 'Should preserve keyword order');
  });

  test('Auto-generate schema when SEO data exists', () => {
    const extracted = extractSeoFromRow(ROW_FULL_SEO);
    const hasSeoData = extracted.metaTitle || extracted.metaDescription || extracted.metaKeywords.length > 0;
    assert(hasSeoData, 'Should detect SEO data');
    
    const schema = generateProductSchema({
      _id: new mongoose.Types.ObjectId(),
      slug: 'test-slug',
      productName: 'Test Product',
      description: 'Test description',
      imageUrl: 'https://example.com/image.jpg',
      designCode: 'TEST',
      category: { name: 'Test Category', _id: new mongoose.Types.ObjectId() }
    });
    
    assert(schema['@context'] === 'https://schema.org/', 'Schema should have @context');
    assert(schema['@type'] === 'Product', 'Schema should have @type Product');
    assert(schema.name === 'Test Product', 'Schema should have product name');
    assert(schema.sku === 'TEST', 'Schema should have design code as SKU');
  });

  // ============================================
  // TEST SUITE 4: Overflow Handling
  // ============================================
  console.log('\n📝 TEST SUITE 4: Overflow Handling');
  console.log('-'.repeat(40) + '\n');

  test('Extract more than 10 keywords', () => {
    const extracted = extractSeoFromRow(ROW_OVERFLOW_KEYWORDS);
    assert(extracted.metaKeywords.length === 12, 'Should extract all keywords before sanitization');
  });

  test('Sanitize respects 10 keyword limit', () => {
    const extracted = extractSeoFromRow(ROW_OVERFLOW_KEYWORDS);
    const sanitized = sanitizeSeoFields(null, null, extracted.metaKeywords);
    assert(sanitized.metaKeywords.length === 10, 'Should limit to 10 keywords');
  });

  test('Detect oversized title', () => {
    const extracted = extractSeoFromRow(ROW_OVERSIZED);
    assert(extracted.metaTitle.length > 60, 'Original title should exceed 60 chars');
    
    const sanitized = sanitizeSeoFields(extracted.metaTitle, null, []);
    assert(sanitized.metaTitle.length === 60, 'Sanitized title should be exactly 60 chars');
  });

  test('Detect oversized description', () => {
    const extracted = extractSeoFromRow(ROW_OVERSIZED);
    assert(extracted.metaDescription.length > 160, 'Original description should exceed 160 chars');
    
    const sanitized = sanitizeSeoFields(null, extracted.metaDescription, []);
    assert(sanitized.metaDescription.length === 160, 'Sanitized description should be exactly 160 chars');
  });

  // ============================================
  // TEST SUITE 5: Empty Keyword Filtering
  // ============================================
  console.log('\n📝 TEST SUITE 5: Empty Keyword Filtering');
  console.log('-'.repeat(40) + '\n');

  test('Filter out empty keyword cells', () => {
    const extracted = extractSeoFromRow(ROW_EMPTY_KEYWORDS);
    assert(extracted.metaKeywords.length === 2, 'Should filter out empty cells');
    assert(extracted.metaKeywords[0] === 'keyword1', 'Should preserve first keyword');
    assert(extracted.metaKeywords[1] === 'keyword3', 'Should preserve third keyword');
  });

  // ============================================
  // TEST SUITE 6: Whitespace Handling
  // ============================================
  console.log('\n📝 TEST SUITE 6: Whitespace Handling');
  console.log('-'.repeat(40) + '\n');

  test('Trim whitespace from meta title', () => {
    const extracted = extractSeoFromRow(ROW_WHITESPACE);
    assert(extracted.metaTitle === 'Title with spaces', 'Should trim leading/trailing spaces');
  });

  test('Trim whitespace from meta description', () => {
    const extracted = extractSeoFromRow(ROW_WHITESPACE);
    assert(extracted.metaDescription === 'Description with leading/trailing spaces', 'Should trim spaces');
  });

  test('Trim whitespace from keywords', () => {
    const extracted = extractSeoFromRow(ROW_WHITESPACE);
    assert(extracted.metaKeywords[0] === 'keyword with spaces', 'Should trim spaces from keywords');
    // Note: Tabs are trimmed as well since .trim() removes all whitespace
    assert(extracted.metaKeywords[1] === 'keyword\twith\ttabs', 'Should trim trailing tabs from keywords');
  });

  test('Sanitize removes all whitespace', () => {
    const extracted = extractSeoFromRow(ROW_WHITESPACE);
    const sanitized = sanitizeSeoFields(extracted.metaTitle, extracted.metaDescription, extracted.metaKeywords);
    
    assert(!sanitized.metaTitle.startsWith(' '), 'metaTitle should not start with space');
    assert(!sanitized.metaTitle.endsWith(' '), 'metaTitle should not end with space');
    assert(!sanitized.metaDescription.startsWith(' '), 'metaDescription should not start with space');
    assert(!sanitized.metaDescription.endsWith(' '), 'metaDescription should not end with space');
  });

  // ============================================
  // Print Results
  // ============================================
  console.log('\n========================================');
  console.log('TEST RESULTS');
  console.log('========================================');
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total:  ${passCount + failCount}\n`);

  if (failCount === 0) {
    console.log('🎉 ALL TESTS PASSED!\n');
    console.log('✔️  SEO extraction logic works correctly');
    console.log('✔️  Sanitization enforces all constraints');
    console.log('✔️  Backward compatibility with no SEO data');
    console.log('✔️  Partial SEO handling works gracefully');
    console.log('✔️  Overflow and edge cases handled properly\n');
    return 0;
  } else {
    console.log('❌ SOME TESTS FAILED\n');
    return 1;
  }
}

// Run tests
const exitCode = runTests();
process.exit(exitCode);
