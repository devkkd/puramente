const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Puramente Website" <${process.env.EMAIL_USER}>`,
    to: options.to || process.env.RECEIVER_EMAIL, 
    subject: options.subject,
    html: options.html,
    // --- NEW: Add support for attachments ---
    attachments: options.attachments || [], 
  };

  // VERCEL FIX: Force the serverless function to wait for the SMTP connection
  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.error("SMTP Connection Error:", error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  // VERCEL FIX: Force the serverless function to wait until the email is fully dispatched
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email Sending Error:", err);
        reject(err);
      } else {
        console.log("Email Sent Successfully:", info.messageId);
        resolve(info);
      }
    });
  });
};

module.exports = sendEmail;