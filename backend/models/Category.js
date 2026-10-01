const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    homeImageUrl: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    storeBannerUrl: {
      type: String,
      required: true
    },
    homeName: {
      type: String,
      required: true,
      trim: true
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

module.exports = mongoose.model("Category", categorySchema);