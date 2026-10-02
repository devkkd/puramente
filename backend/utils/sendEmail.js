const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER or EMAIL_PASS not configured in .env");
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

    console.log(`?? Sending email: ${mailOptions.subject} ? ${mailOptions.to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`? Email sent: ${info.messageId}`);
    
    return info;
  } catch (error) {
    console.error(`? Email error: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
