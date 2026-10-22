const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("[EMAIL_DEBUG] ===== EMAIL SEND START =====");
    console.log("[EMAIL_DEBUG] Recipient:", options.to);
    console.log("[EMAIL_DEBUG] Subject:", options.subject);
    console.log("[EMAIL_DEBUG] Type:", options.emailType || "transactional");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[EMAIL_ERROR] Missing credentials - EMAIL_USER or EMAIL_PASS not set in .env");
      return { success: false, error: "Missing credentials" };
    }

    console.log("[EMAIL_DEBUG] EMAIL_USER:", process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test the connection
    console.log("[EMAIL_DEBUG] Testing SMTP connection...");
    await transporter.verify();
    console.log("[EMAIL_DEBUG] SMTP connection verified");

    // Convert HTML to plain text
    const stripHtmlAndDecode = (html) => {
      return html
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    };

    let headers = {
      "X-Mailer": "Puramente-Jewelry",
      "MIME-Version": "1.0"
    };

    if (options.emailType === "customer") {
      headers["X-Priority"] = "3";
      headers["Importance"] = "normal";
    } 
    else if (options.emailType === "admin") {
      headers["Precedence"] = "bulk";
      headers["X-Priority"] = "3";
    }

    const plainText = stripHtmlAndDecode(options.html);

    const mailOptions = {
      from: `Puramente Jewelry <${process.env.EMAIL_USER}>`,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      text: plainText,
      html: options.html,
      attachments: options.attachments || [],
      headers: headers,
      replyTo: process.env.EMAIL_USER,
      priority: "normal"
    };

    console.log("[EMAIL_DEBUG] Mail options prepared:", JSON.stringify({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasAttachments: (mailOptions.attachments || []).length > 0
    }, null, 2));

    console.log("[EMAIL_DEBUG] Sending email...");
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`[EMAIL_SUCCESS] Email sent successfully!`);
    console.log(`[EMAIL_SUCCESS] Recipient: ${mailOptions.to}`);
    console.log(`[EMAIL_SUCCESS] MessageID: ${result.messageId}`);
    console.log("[EMAIL_DEBUG] ===== EMAIL SEND COMPLETE =====");
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error("[EMAIL_ERROR] ===== EMAIL SEND FAILED =====");
    console.error("[EMAIL_ERROR] Error message:", error.message);
    console.error("[EMAIL_ERROR] Error code:", error.code);
    console.error("[EMAIL_ERROR] Full error:", error);
    console.error("[EMAIL_ERROR] ===== EMAIL SEND FAILED END =====");
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
