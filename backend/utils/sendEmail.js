const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("\n?? === INITIALIZING EMAIL SENDING ===");
    console.log("?? EMAIL_USER:", process.env.EMAIL_USER);
    console.log("?? EMAIL_PASS length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "NOT SET");
    console.log("?? RECEIVER_EMAIL:", process.env.RECEIVER_EMAIL);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER or EMAIL_PASS not set in .env");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("? Transporter created");

    // Verify transporter connection
    console.log("?? Verifying transporter...");
    await transporter.verify();
    console.log("? Transporter verified - connection working!");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    };

    console.log("\n?? SENDING EMAIL");
    console.log("   From:", mailOptions.from);
    console.log("   To:", mailOptions.to);
    console.log("   Subject:", mailOptions.subject);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log("\n? === EMAIL SENT SUCCESSFULLY ===");
    console.log("?? Message ID:", info.messageId);
    console.log("?? Response:", info.response);
    console.log("==========================================\n");
    
    return info;
  } catch (error) {
    console.error("\n? === EMAIL ERROR ===");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Full Error Details:");
    console.error(JSON.stringify(error, null, 2));
    console.error("==========================================\n");
    throw error;
  }
};

module.exports = sendEmail;
