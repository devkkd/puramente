const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("[EMAIL] Sending email to:", options.to);
    console.log("[EMAIL] Type:", options.emailType || "transactional");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return { success: false, error: "Missing email credentials" };
    }

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

    // Convert HTML to plain text
    const stripHtmlAndDecode = (html) => {
      return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    };

    // Minimal headers to avoid spam filters
    let headers = {
      "X-Mailer": "Puramente-Jewelry",
      "MIME-Version": "1.0"
    };

    // For customer emails - NO bulk headers
    if (options.emailType === "customer") {
      headers["X-Priority"] = "3";
      headers["Importance"] = "normal";
      // Deliberately exclude Precedence, List-Unsubscribe to avoid spam
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

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL_SUCCESS] Sent to ${mailOptions.to} | ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error("[EMAIL_ERROR]", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
