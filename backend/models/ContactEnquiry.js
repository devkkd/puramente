const mongoose = require("mongoose");

const contactEnquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String },
    companyWebsite: { type: String },
    phone: { type: String, required: true },
    country: { type: String },
    orderVolume: { type: String },
    message: { type: String, required: true },
    status: { type: String, default: "Unread" } // Options: Unread, Read, Replied
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);