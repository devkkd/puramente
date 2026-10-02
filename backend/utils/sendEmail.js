const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[EMAIL] Missing EMAIL_USER or EMAIL_PASS in .env");
      return { success: false, error: "Email not configured" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Puramente" <${process.env.EMAIL_USER}>`,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    };

    console.log(`[EMAIL] Sending: ${mailOptions.subject} -> ${mailOptions.to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SUCCESS] Email sent: ${info.messageId}`);
    
    return info;
  } catch (error) {
    console.error(`[EMAIL_ERROR] ${error.message}`);
    console.error(`[EMAIL_ERROR] Code: ${error.code}`);
    // Don't throw - just log and return error object
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
