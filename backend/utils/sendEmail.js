const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("[EMAIL] Starting email send attempt...");
    console.log("[EMAIL] To:", options.to || process.env.RECEIVER_EMAIL);
    console.log("[EMAIL] Subject:", options.subject);
    console.log("[EMAIL] Email type:", options.emailType || "transactional");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[EMAIL_ERROR] Missing email credentials in .env");
      console.error("[EMAIL_ERROR] EMAIL_USER:", process.env.EMAIL_USER ? "SET" : "MISSING");
      console.error("[EMAIL_ERROR] EMAIL_PASS:", process.env.EMAIL_PASS ? "SET (length: " + process.env.EMAIL_PASS.length + ")" : "MISSING");
      return { success: false, error: "Missing credentials" };
    }

    console.log("[EMAIL] Creating transporter with Gmail SMTP...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
      textEncoding: "utf-8",
      tls: {
        rejectUnauthorized: false
      }
    });

    // Convert HTML to plain text by stripping tags and decoding entities
    const stripHtmlAndDecode = (html) => {
      return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
        .replace(/<[^>]+>/g, '') // Remove all HTML tags
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

    // Headers for different email types
    let baseHeaders = {
      "X-Priority": "3 (Normal)",
      "X-MSMail-Priority": "Normal",
      "Importance": "Normal",
      "X-Mailer": "Puramente-CMS",
      "X-Entity-Ref-ID": options.messageId || `${Date.now()}@puramente.com`,
      "MIME-Version": "1.0"
    };

    // For CUSTOMER emails - optimized for inbox delivery
    if (options.emailType === "customer") {
      baseHeaders["Return-Path"] = process.env.EMAIL_USER;
      baseHeaders["Reply-To"] = process.env.EMAIL_USER;
      baseHeaders["Sender"] = process.env.EMAIL_USER;
      baseHeaders["X-Mail-Type"] = "Transactional";
      // No bulk headers for customer emails - keeps them in inbox
    } 
    // For ADMIN emails - can include bulk headers
    else if (options.emailType === "admin") {
      baseHeaders["Precedence"] = "bulk";
      baseHeaders["List-Unsubscribe"] = `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`;
      baseHeaders["Return-Path"] = process.env.EMAIL_USER;
      baseHeaders["X-Mail-Type"] = "Transactional";
    }

    // Generate plain text version from HTML
    const plainText = stripHtmlAndDecode(options.html);

    const mailOptions = {
      from: `Puramente Jewelry <${process.env.EMAIL_USER}>`,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      text: plainText, // Plain text alternative (important for spam filters)
      html: options.html,
      attachments: options.attachments || [],
      headers: baseHeaders,
      replyTo: process.env.EMAIL_USER,
      inReplyTo: options.messageId || undefined,
      references: options.messageId || undefined
    };

    // Remove undefined fields
    if (!mailOptions.inReplyTo) delete mailOptions.inReplyTo;
    if (!mailOptions.references) delete mailOptions.references;

    console.log("[EMAIL] Mail options prepared");
    console.log("[EMAIL] Email Type:", options.emailType || "transactional");
    console.log("[EMAIL] Has attachments:", (options.attachments || []).length > 0);
    console.log("[EMAIL] Attachments:", (options.attachments || []).map(a => ({ filename: a.filename, contentType: a.contentType })));
    console.log("[EMAIL] Sending mail...");
    const result = await transporter.sendMail(mailOptions);

    console.log(`[EMAIL_SUCCESS] Email sent to ${mailOptions.to} | MessageID: ${result.messageId} | Type: ${options.emailType || "transactional"}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("[EMAIL_ERROR] Exception occurred:", error.message);
    console.error("[EMAIL_ERROR] Error code:", error.code);
    console.error("[EMAIL_ERROR] Full error:", JSON.stringify(error, null, 2));
    return { success: false, error: error.message, code: error.code };
  }
};

module.exports = sendEmail;
