const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String,
  designCode: String,
  metalType: String,
  customFinish: String,
  quantityBand: String
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    contactDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      companyName: String,
      companyWebsite: String,
      whatsappNo: { type: String, required: true },
      country: String,
      message: { type: String, required: true }
    },
    items: [orderItemSchema],
    status: { type: String, default: "Pending" } // E.g., Pending, Reviewed, Fulfilled
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);