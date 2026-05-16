const ContactEnquiry = require("../models/ContactEnquiry");
const sendEmail = require("../utils/sendEmail"); // <-- IMPORT ADDED

// Submit a new contact enquiry
exports.submitEnquiry = async (req, res) => {
  try {
    const { 
      fullName, email, companyName, companyWebsite, 
      phone, country, orderVolume, message 
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ success: false, error: "Please fill in all required fields." });
    }

    const newEnquiry = new ContactEnquiry({
      fullName,
      email,
      companyName,
      companyWebsite,
      phone,
      country,
      orderVolume,
      message
    });

    await newEnquiry.save();

    // --- SEND EMAIL NOTIFICATION TO ADMIN ---
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0082A4;">New Contact Enquiry 📩</h2>
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

    await sendEmail({
      subject: `New Contact Enquiry from ${fullName}`,
      html: emailHtml,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! Our team will get back to you soon.",
      data: newEnquiry
    });

  } catch (error) {
    console.error("Contact Enquiry Error:", error);
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

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!enquiry) return res.status(404).json({ success: false, error: "Enquiry not found" });

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    res.status(500).json({ success: false, error: "Server error." });
  }
};