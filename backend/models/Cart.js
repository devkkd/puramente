const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  metalType: {
    type: String,
    required: true
  },
  customFinish: {
    type: String,
    required: true
  },
  quantityBand: {
    type: String,
    enum: ["10-25 Pieces", "25-50 Pieces", "50-100 Pieces", "100+ Pieces"],
    default: "10-25 Pieces"
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true // <-- STRICTLY REQUIRED NOW
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);