const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullName, country, whatsappNo, companyName, companyWebsite } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: "User already exists" });

    const user = await User.create({ email, password, fullName, country, whatsappNo, companyName, companyWebsite });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error during registration" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      
      // --- NEW: SEND LOGIN ALERT EMAIL TO OWNER ---
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-w: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #0082A4;">User Login Alert 🔐</h2>
            <p>A client has just successfully logged into the Puramente website.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
            <p><strong>Name:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
            <p><strong>Company:</strong> ${user.companyName || "N/A"}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        `;

        // Await the email so Vercel doesn't kill the background process, 
        // but wrapped in try/catch so if email fails, user still logs in perfectly fine.
        await sendEmail({
          subject: `Client Login: ${user.fullName}`,
          html: emailHtml,
          // Omitting 'to' automatically sends it to process.env.RECEIVER_EMAIL based on your sendEmail.js
        });
      } catch (emailErr) {
        console.error("Non-fatal: Failed to send login alert to admin:", emailErr);
      }
      // ---------------------------------------------

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error during login" });
  }
};


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

      const token = jwt.sign(
        { id: "admin_hardcoded_id", role: "admin" },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "30d" }
      );

      return res.status(200).json({
        success: true,
        data: {
          email: process.env.ADMIN_EMAIL,
          role: "admin",
          token: token
        }
      });
    } else {
      return res.status(401).json({ success: false, error: "Invalid admin credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error during admin login" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    console.log(`\n--- PASSWORD RESET INITIATED FOR: ${req.body.email} ---`);
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("❌ Failed: No user found in database with this email.");
      return res.status(404).json({ success: false, error: "There is no user with that email" });
    }

    console.log("✅ User found. Generating secure reset token...");
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    console.log("✅ Token saved to database.");

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0082A4;">Reset Your Password</h2>
        <p>You are receiving this email because you requested a password reset for your Puramente account.</p>
        <p>Click the button below to reset your password. This link is valid for 10 minutes.</p>
        <br/>
        <a href="${resetUrl}" style="display: inline-block; background-color: #0082A4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
    `;

    try {
      console.log(`⏳ Attempting to send email to the user: ${user.email}...`);
      
      await sendEmail({
        to: user.email, 
        subject: "Puramente - Password Reset Request",
        html: message,
      });
      
      console.log("✅ Email successfully sent to user!");
      res.status(200).json({ success: true, message: "Email sent" });
      
    } catch (emailError) {
      console.error("\n❌ NODEMAILER FAILED TO SEND. EXACT REASON:");
      console.error(emailError); 
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({ success: false, error: "Email could not be sent" });
    }
  } catch (error) {
    console.error("\n❌ OUTER SERVER ERROR:");
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log(`\n--- PASSWORD RESET ATTEMPT ---`);
    console.log(`Token received from URL: ${req.params.token}`);
    
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(`Hashed token for DB lookup: ${resetPasswordToken}`);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, 
    });

    if (!user) {
      console.log("❌ Failed: Token is invalid or has expired.");
      return res.status(400).json({ success: false, error: "Invalid or expired token" });
    }

    console.log(`✅ User found: ${user.email}. Attempting to save new password...`);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    console.log("✅ Password successfully updated and saved to DB!");
    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("\n❌ SERVER ERROR DURING PASSWORD RESET:");
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};