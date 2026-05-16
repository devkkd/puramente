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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);