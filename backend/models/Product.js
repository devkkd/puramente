// models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    designCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String,
      required: true
    },

    newArrival: {
      type: Boolean,
      default: false
    },

    bestSeller: {
      type: Boolean,
      default: false
    },

    option: {
      type: String,
      enum: ["with gem", "without gem"],
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    // SEO Fields
    seo: {
      metaTitle: {
        type: String,
        default: null,
        trim: true,
        maxlength: 60
      },
      metaDescription: {
        type: String,
        default: null,
        trim: true,
        maxlength: 160
      },
      metaKeywords: {
        type: [String],
        default: []
      },
      schema: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);