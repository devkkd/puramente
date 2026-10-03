const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[EMAIL_ERROR] Missing credentials");
      return { success: false };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: `"Puramente" <${process.env.EMAIL_USER}>`,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("[EMAIL_ERROR]", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
