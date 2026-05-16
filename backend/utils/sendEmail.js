const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
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
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    // We throw the error here so the controller's catch block can print it!
    throw error; 
  }
};

module.exports = sendEmail;