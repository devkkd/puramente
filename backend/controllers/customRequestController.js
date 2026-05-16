const CustomRequest = require("../models/CustomRequest");
const { uploadToCloudflare } = require("../utils/upload");
const sendEmail = require("../utils/sendEmail"); // <-- IMPORT ADDED

exports.submitCustomRequest = async (req, res) => {
  try {
    const data = req.body;
    let referenceImageUrl = "";

    // Upload the reference image to Cloudflare if provided
    if (req.file) {
      referenceImageUrl = await uploadToCloudflare(req.file);
    }

    const newRequest = new CustomRequest({
      userId: data.userId || null,
      category: data.category,
      clientInfo: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        address: data.address,
        state: data.state
      },
      dimensions: {
        length: data.length,
        width: data.width
      },
      metal: data.metal,
      stone: {
        type: data.stoneType,
        details: data.stoneDetails
      },
      designNotes: data.designNotes,
      referenceImageUrl
    });

    await newRequest.save();

    // --- SEND EMAIL NOTIFICATION TO ADMIN ---
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0082A4;">New Custom Jewelry Request ✨</h2>
        <p>A client has submitted a new bespoke/custom jewelry request.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <h3 style="margin-bottom: 5px;">Client Information</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
        <p><strong>Country/Location:</strong> ${data.country || "N/A"} (${data.state || "N/A"})</p>
        
        <h3 style="margin-bottom: 5px; margin-top: 20px;">Design Specs</h3>
        <p><strong>Category:</strong> ${data.category}</p>
        <p><strong>Dimensions:</strong> ${data.length} x ${data.width}</p>
        <p><strong>Metal:</strong> ${data.metal}</p>
        <p><strong>Stone:</strong> ${data.stoneType} - ${data.stoneDetails}</p>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-weight: bold;">Design Notes:</p>
          <p style="margin-top: 5px; white-space: pre-wrap;">${data.designNotes}</p>
        </div>

        ${referenceImageUrl ? `<p style="margin-top: 20px;"><strong>📎 <a href="${referenceImageUrl}" target="_blank">Click here to view the attached Reference Image</a></strong></p>` : `<p style="margin-top: 20px;"><em>No reference image was attached.</em></p>`}
        
        <br/>
        <a href="${process.env.FRONTEND_URL}/admin/custom-requests" style="display: inline-block; background-color: #0082A4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Request Details</a>
      </div>
    `;

    await sendEmail({
      subject: `New Custom Request from ${data.fullName}`,
      html: emailHtml,
    });

    res.status(201).json({
      success: true,
      message: "Custom jewelry request submitted successfully!",
      data: newRequest
    });

  } catch (error) {
    console.error("Custom Request Error:", error);
    res.status(500).json({ success: false, error: "Failed to submit custom request." });
  }
};

// For Admin Panel
exports.getAllCustomRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error." });
  }
};

exports.updateCustomRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const request = await CustomRequest.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!request) return res.status(404).json({ success: false, error: "Request not found" });
    
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};