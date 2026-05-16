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
    storeBannerUrl: { // <-- NEW FIELD
      type: String,
      required: true
    },
    homeName: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);