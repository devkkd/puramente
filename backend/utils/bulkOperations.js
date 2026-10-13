/**
 * Bulk Operations Utility Module
 * 
 * Provides functions for:
 * - Validating bulk product IDs
 * - Validating fields for bulk updates
 * - Processing bulk MongoDB operations with error tracking
 * - Maintaining operation integrity
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { sanitizeSeoFields: sanitizeSeoFieldsHelper, generateProductSchema } = require('./seoHelper');

/**
 * Validates MongoDB ObjectId format (24 hex characters)
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId format
 */
function isValidObjectId(id) {
  return /^[0-9a-f]{24}$/.test(id);
}

/**
 * Validates all product IDs exist in database and are valid format
 * 
 * @param {string[]} productIds - Array of product IDs to validate
 * @returns {Promise<Object>} - { isValid: boolean, validIds: string[], invalidIds: string[], missingIds: string[], errors: string[] }
 * 
 * @example
 * const result = await validateBulkProductIds(['id1', 'id2']);
 * if (!result.isValid) {
 *   console.log('Invalid IDs:', result.invalidIds);
 *   console.log('Missing IDs:', result.missingIds);
 * }
 */
async function validateBulkProductIds(productIds) {
  const result = {
    isValid: true,
    validIds: [],
    invalidIds: [],
    missingIds: [],
    errors: []
  };

  if (!Array.isArray(productIds) || productIds.length === 0) {
    result.isValid = false;
    result.errors.push('Product IDs must be a non-empty array');
    return result;
  }

  if (productIds.length > 1000) {
    result.isValid = false;
    result.errors.push('Cannot bulk update more than 1000 products at once');
    return result;
  }

  // Validate format of each ID
  const formatValidIds = productIds.filter(id => {
    if (isValidObjectId(id)) {
      result.validIds.push(id);
      return true;
    } else {
      result.invalidIds.push(id);
      result.errors.push(`Invalid ObjectId format: ${id}`);
      return false;
    }
  });

  if (result.validIds.length === 0) {
    result.isValid = false;
    result.errors.push('No valid product IDs provided');
    return result;
  }

  // Check which valid IDs actually exist in database
  try {
    const existingProducts = await Product.find(
      { _id: { $in: result.validIds.map(id => mongoose.Types.ObjectId(id)) } },
      '_id'
    ).lean();

    const existingIds = new Set(existingProducts.map(p => p._id.toString()));

    result.validIds = result.validIds.filter(id => existingIds.has(id));
    result.missingIds = formatValidIds.filter(id => !existingIds.has(id));

    if (result.missingIds.length > 0) {
      result.isValid = false;
      result.errors.push(
        `${result.missingIds.length} product(s) not found: ${result.missingIds.join(', ')}`
      );
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Database query error: ${error.message}`);
  }

  // If we have some valid IDs, we can proceed (partial failure allowed)
  if (result.validIds.length > 0) {
    result.isValid = true;
  }

  return result;
}

/**
 * Validates and sanitizes fields for bulk update operation
 * 
 * Allowed fields: productName, description, category, bestSeller, newArrival, seo
 * Rejects unknown fields and validates data types
 * 
 * @param {Object} updateFields - Object containing fields to update
 * @returns {Promise<Object>} - { isValid: boolean, sanitizedFields: Object, errors: string[] }
 * 
 * @example
 * const result = await validateBulkUpdateFields({
 *   productName: 'New Name',
 *   bestSeller: true,
 *   seo: { metaTitle: 'Title' }
 * });
 */
async function validateBulkUpdateFields(updateFields) {
  const result = {
    isValid: true,
    sanitizedFields: {},
    errors: []
  };

  if (!updateFields || typeof updateFields !== 'object') {
    result.isValid = false;
    result.errors.push('Update fields must be a non-empty object');
    return result;
  }

  const allowedFields = {
    productName: 'string',
    description: 'string',
    category: 'string',
    bestSeller: 'boolean',
    newArrival: 'boolean',
    seo: 'object'
  };

  const fieldKeys = Object.keys(updateFields);

  if (fieldKeys.length === 0) {
    result.isValid = false;
    result.errors.push('At least one field must be updated');
    return result;
  }

  // Check for unknown fields
  const unknownFields = fieldKeys.filter(key => !allowedFields[key]);
  if (unknownFields.length > 0) {
    result.isValid = false;
    result.errors.push(
      `Unknown fields: ${unknownFields.join(', ')}. Allowed fields: ${Object.keys(allowedFields).join(', ')}`
    );
    return result;
  }

  // Validate and sanitize each field
  for (const [field, value] of Object.entries(updateFields)) {
    const expectedType = allowedFields[field];

    if (field === 'productName') {
      if (typeof value !== 'string' || value.trim().length === 0) {
        result.errors.push('productName must be a non-empty string');
      } else {
        result.sanitizedFields.productName = value.trim();
      }
    }

    if (field === 'description') {
      if (typeof value !== 'string' || value.trim().length === 0) {
        result.errors.push('description must be a non-empty string');
      } else {
        result.sanitizedFields.description = value.trim();
      }
    }

    if (field === 'category') {
      if (typeof value !== 'string' || !isValidObjectId(value)) {
        result.errors.push('category must be a valid MongoDB ObjectId');
      } else {
        // Verify category exists
        try {
          const categoryExists = await Category.findById(value);
          if (!categoryExists) {
            result.errors.push(`Category not found: ${value}`);
          } else {
            result.sanitizedFields.category = value;
          }
        } catch (error) {
          result.errors.push(`Error validating category: ${error.message}`);
        }
      }
    }

    if (field === 'bestSeller') {
      if (typeof value !== 'boolean') {
        result.errors.push('bestSeller must be a boolean');
      } else {
        result.sanitizedFields.bestSeller = value;
      }
    }

    if (field === 'newArrival') {
      if (typeof value !== 'boolean') {
        result.errors.push('newArrival must be a boolean');
      } else {
        result.sanitizedFields.newArrival = value;
      }
    }

    if (field === 'seo' && value) {
      try {
        // Sanitize and validate SEO fields - handle both object and individual args
        let sanitizedSeo;
        if (typeof value === 'object' && value.metaTitle) {
          // Value is already an object with metaTitle, metaDescription, metaKeywords
          sanitizedSeo = {
            metaTitle: value.metaTitle ? String(value.metaTitle).trim().slice(0, 60) : null,
            metaDescription: value.metaDescription ? String(value.metaDescription).trim().slice(0, 160) : null,
            metaKeywords: Array.isArray(value.metaKeywords) 
              ? value.metaKeywords.map(k => String(k).trim()).filter(k => k.length > 0).slice(0, 10)
              : []
          };
        } else {
          // Fallback to helper function
          sanitizedSeo = sanitizeSeoFieldsHelper(value);
        }
        result.sanitizedFields.seo = sanitizedSeo;
      } catch (error) {
        result.errors.push(`Invalid SEO fields: ${error.message}`);
      }
    }
  }

  if (result.errors.length > 0) {
    result.isValid = false;
  }

  return result;
}

/**
 * Processes bulk update operation with comprehensive error tracking
 * Uses MongoDB transactions for atomicity
 * 
 * Returns detailed operation result with success/failure breakdown
 * 
 * @param {string[]} productIds - Array of product IDs to update
 * @param {Object} updateFields - Fields to update (already validated/sanitized)
 * @returns {Promise<Object>} - {
 *   success: boolean,
 *   updatedCount: number,
 *   failedCount: number,
 *   failedIds: string[],
 *   errors: { id: string, error: string }[],
 *   updatedProducts: Object[],
 *   timestamp: string
 * }
 * 
 * @example
 * const result = await processBulkUpdate(
 *   ['id1', 'id2', 'id3'],
 *   { bestSeller: true }
 * );
 */
async function processBulkUpdate(productIds, updateFields) {
  const result = {
    success: false,
    updatedCount: 0,
    failedCount: 0,
    failedIds: [],
    errors: [],
    updatedProducts: [],
    timestamp: new Date().toISOString()
  };

  if (!Array.isArray(productIds) || productIds.length === 0) {
    result.errors.push('Product IDs must be a non-empty array');
    return result;
  }

  if (!updateFields || Object.keys(updateFields).length === 0) {
    result.errors.push('Update fields cannot be empty');
    return result;
  }

  // Start MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Prepare update document
    const updateDoc = { ...updateFields };

    // If updating SEO fields, generate schema markup
    if (updateDoc.seo) {
      updateDoc.seo = sanitizeSeoFieldsHelper(
        updateDoc.seo.metaTitle,
        updateDoc.seo.metaDescription,
        updateDoc.seo.metaKeywords
      );
      // Schema generation will be handled per-product
    }

    // Perform bulk update with individual product tracking
    for (const productId of productIds) {
      try {
        // Find product
        const product = await Product.findById(productId).session(session);

        if (!product) {
          result.failedIds.push(productId);
          result.errors.push({
            id: productId,
            error: 'Product not found'
          });
          result.failedCount++;
          continue;
        }

        // Apply updates
        const updatedProduct = Object.assign(product, updateDoc);

        // If SEO is being updated, regenerate schema
        if (updateDoc.seo) {
          try {
            const schema = generateProductSchema(updatedProduct.toObject());
            updatedProduct.seo.schema = schema;
          } catch (schemaError) {
            console.warn(`Warning: Could not generate schema for product ${productId}`, schemaError.message);
            // Continue anyway - schema generation failure is not critical
          }
        }

        // Save updated product
        await updatedProduct.save({ session });

        // Add to successful updates
        result.updatedProducts.push(updatedProduct.toObject());
        result.updatedCount++;

      } catch (error) {
        result.failedIds.push(productId);
        result.errors.push({
          id: productId,
          error: error.message || 'Unknown error during update'
        });
        result.failedCount++;
        // Continue with next product instead of stopping
      }
    }

    // Commit transaction if at least some products were updated
    if (result.updatedCount > 0) {
      await session.commitTransaction();
      result.success = true;
    } else {
      // Rollback if no products were updated
      await session.abortTransaction();
      result.success = false;
      result.errors.unshift('No products could be updated - operation rolled back');
    }

  } catch (error) {
    // Rollback on transaction error
    await session.abortTransaction();
    result.success = false;
    result.errors.unshift(`Transaction error: ${error.message}`);
    result.updatedCount = 0;
    result.updatedProducts = [];

  } finally {
    await session.endSession();
  }

  // Ensure at least partial success if we updated anything
  if (result.updatedCount > 0) {
    result.success = true;
  }

  return result;
}

/**
 * Performs complete bulk edit operation with validation
 * 
 * Orchestrates validation -> processing -> error reporting
 * 
 * @param {string[]} productIds - Product IDs to update
 * @param {Object} updateFields - Fields to update
 * @returns {Promise<Object>} - Complete operation result
 */
async function executeBulkEdit(productIds, updateFields) {
  // Validate IDs
  const idValidation = await validateBulkProductIds(productIds);
  if (!idValidation.isValid && idValidation.validIds.length === 0) {
    return {
      success: false,
      error: 'No valid product IDs provided',
      details: idValidation
    };
  }

  // Validate fields
  const fieldValidation = await validateBulkUpdateFields(updateFields);
  if (!fieldValidation.isValid) {
    return {
      success: false,
      error: 'Invalid update fields',
      details: fieldValidation
    };
  }

  // Process bulk update with valid IDs and sanitized fields
  const result = await processBulkUpdate(
    idValidation.validIds,
    fieldValidation.sanitizedFields
  );

  return result;
}

module.exports = {
  isValidObjectId,
  validateBulkProductIds,
  validateBulkUpdateFields,
  processBulkUpdate,
  executeBulkEdit
};
