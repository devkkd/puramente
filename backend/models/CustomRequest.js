const mongoose = require("mongoose");

const customRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    category: { type: String, required: true },
    clientInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String },
      address: { type: String },
      state: { type: String }
    },
    dimensions: {
      length: { type: String },
      width: { type: String }
    },
    metal: { type: String, required: true },
    stone: {
      type: { type: String },
      details: { type: String }
    },
    designNotes: { type: String },
    referenceImageUrl: { type: String }, // Uploaded to Cloudflare
    status: { type: String, default: "Pending" } // Pending, Reviewed, In Production, Fulfilled
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomRequest", customRequestSchema);