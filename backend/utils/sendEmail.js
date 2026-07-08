const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
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
    attachments: options.attachments || [],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent:", info.messageId);
  return info;
};

module.exports = sendEmail;
