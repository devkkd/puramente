const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[EMAIL_ERROR] Missing email credentials");
      return { success: false };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build email with proper headers for inbox delivery
    const mailOptions = {
      from: `Puramente Jewelry <${process.env.EMAIL_USER}>`,
      to: options.to || process.env.RECEIVER_EMAIL,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
      headers: {
        "X-Priority": "3 (Normal)",
        "X-MSMail-Priority": "Normal",
        "Importance": "Normal",
        "X-Mailer": "Puramente-CMS",
        "List-Unsubscribe": `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
        "X-Mail-Type": "Transactional"
      },
      replyTo: process.env.EMAIL_USER,
      inReplyTo: options.messageId || undefined,
      references: options.messageId || undefined
    };

    // Remove undefined fields
    if (!mailOptions.inReplyTo) delete mailOptions.inReplyTo;
    if (!mailOptions.references) delete mailOptions.references;

    const result = await transporter.sendMail(mailOptions);

    console.log(`[EMAIL_SUCCESS] Email sent to ${mailOptions.to} | MessageID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("[EMAIL_ERROR]", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
