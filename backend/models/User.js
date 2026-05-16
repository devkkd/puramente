const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Built-in Node.js module

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    country: { type: String, default: "" },
    whatsappNo: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    
    // --- NEW FIELDS FOR PASSWORD RESET ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- NEW METHOD: Generate Reset Token ---
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash it and set to resetPasswordToken field in the DB
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set expiration to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed version to email to the user
};

module.exports = mongoose.model("User", userSchema);