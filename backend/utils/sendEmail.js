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
      textEncoding: "utf-8"
    });

    // Build email with proper headers for inbox delivery
    // IMPORTANT: Do NOT set Content-Type in headers when attachments present
    // Nodemailer will automatically set multipart/mixed with proper boundaries
    
    // Headers for different email types
    let baseHeaders = {
      "X-Priority": "3 (Normal)",
      "X-MSMail-Priority": "Normal",
      "Importance": "Normal",
      "X-Mailer": "Puramente-CMS",
      "X-Entity-Ref-ID": options.messageId || `${Date.now()}@puramente.com`,
      "X-Originating-IP": "[127.0.0.1]",
      "X-Mail-Type": "Transactional"
    };

    // Only add bulk/precedence headers for admin emails, NOT for customer transactional emails
    if (options.emailType === "admin") {
      baseHeaders["Precedence"] = "bulk";
      baseHeaders["List-Unsubscribe"] = `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`;
    }
    // For "customer" emails, keep headers minimal to avoid spam filters

    const mailOptions = {
      from: `Puramente Jewelry <${process.env.EMAIL_USER}>`,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
      headers: baseHeaders,
      replyTo: options.replyTo || process.env.EMAIL_USER,
      inReplyTo: options.messageId || undefined,
      references: options.messageId || undefined
    };

    // Remove undefined fields
    if (!mailOptions.inReplyTo) delete mailOptions.inReplyTo;
    if (!mailOptions.references) delete mailOptions.references;

    console.log("[EMAIL] Mail options prepared");
    console.log("[EMAIL] Has attachments:", (options.attachments || []).length > 0);
    console.log("[EMAIL] Attachments:", (options.attachments || []).map(a => ({ filename: a.filename, contentType: a.contentType })));
    console.log("[EMAIL] Sending mail with options:", { to: mailOptions.to, subject: mailOptions.subject, emailType: options.emailType || "transactional" });
    const result = await transporter.sendMail(mailOptions);

    console.log(`[EMAIL_SUCCESS] Email sent to ${mailOptions.to} | MessageID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("[EMAIL_ERROR] Exception occurred:", error.message);
    console.error("[EMAIL_ERROR] Error code:", error.code);
    console.error("[EMAIL_ERROR] Full error:", JSON.stringify(error, null, 2));
    return { success: false, error: error.message, code: error.code };
  }
};

module.exports = sendEmail;