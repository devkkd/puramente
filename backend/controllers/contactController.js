const ContactEnquiry = require("../models/ContactEnquiry");
const sendEmail = require("../utils/sendEmail");

// Submit a new contact enquiry
exports.submitEnquiry = async (req, res) => {
  try {
    const { fullName, email, companyName, companyWebsite, phone, country, orderVolume, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ success: false, error: "Please fill in all required fields." });
    }

    const newEnquiry = new ContactEnquiry({
      fullName, email, companyName, companyWebsite, phone, country, orderVolume, message
    });

    await newEnquiry.save();
    console.log(`[EMAIL] Enquiry saved: ${newEnquiry._id} from ${fullName}`);

    // Send admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0082A4;">New Contact Enquiry</h2>
        <p>A new contact enquiry has been submitted on the Puramente website.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country || "N/A"}</p>
        <p><strong>Company:</strong> ${companyName || "N/A"} ${companyWebsite ? `(<a href="${companyWebsite}">${companyWebsite}</a>)` : ""}</p>
        <p><strong>Order Volume:</strong> ${orderVolume || "N/A"}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-weight: bold;">Message:</p>
          <p style="margin-top: 5px; white-space: pre-wrap;">${message}</p>
        </div>
        <br/>
        <a href="${process.env.FRONTEND_URL}/admin/contact" style="display: inline-block; background-color: #0082A4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin Panel</a>
      </div>
    `;

    try {
      console.log("[EMAIL] Sending admin notification...");
      await sendEmail({
        subject: `New Contact Enquiry from ${fullName}`,
        html: adminEmailHtml,
      });
    } catch (emailError) {
      console.error(`[EMAIL_ERROR] Admin notification failed: ${emailError.message}`);
    }

    // Send customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0082A4;">We Received Your Message</h2>
        <p>Thank you for reaching out to Puramente. We have received your enquiry and appreciate your interest.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <p>Our team will review your message and get back to you within <strong>24 business hours</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-weight: bold;">Message Details:</p>
          <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="margin-top: 25px; font-size: 13px; color: #666;">
          If you need immediate assistance, contact us:<br/>
          <strong>Phone:</strong> +91 9314 346 148<br/>
          <strong>WhatsApp:</strong> +91 97991 68300<br/>
          <strong>Email:</strong> info@puramentejewel.com
        </p>
        
        <br/>
        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #0082A4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Products</a>
      </div>
    `;

    try {
      console.log("[EMAIL] Sending customer confirmation...");
      await sendEmail({
        to: email,
        subject: `We Received Your Message`,
        html: customerEmailHtml
      });
    } catch (customerEmailError) {
      console.error(`[EMAIL_ERROR] Customer confirmation failed: ${customerEmailError.message}`);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! Our team will get back to you soon.",
      data: newEnquiry
    });

  } catch (error) {
    console.error(`[ERROR] Contact enquiry error: ${error.message}`);
    res.status(500).json({ success: false, error: "Failed to submit message." });
  }
};

// Admin: Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ success: false, error: "Server error fetching enquiries." });
  }
};

// Admin: Update status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = await ContactEnquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, error: "Enquiry not found" });
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

// Admin: Delete enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await ContactEnquiry.findByIdAndDelete(id);
    if (!enquiry) return res.status(404).json({ success: false, error: "Enquiry not found" });
    res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({ success: false, error: "Server error deleting enquiry." });
  }
};

module.exports = exports;
