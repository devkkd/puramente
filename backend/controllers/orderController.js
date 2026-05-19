const Order = require("../models/Order");
const Cart = require("../models/Cart");
const sendEmail = require("../utils/sendEmail");

exports.submitOrder = async (req, res) => {
  try {
    const { userId, sessionId, contactDetails } = req.body;
    
    // 1. Find the cart using userId or sessionId
    const query = userId ? { userId } : { sessionId: sessionId || 'guest' };
    const cart = await Cart.findOne(query).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    // 2. Map cart items into the order format
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      productName: item.product.productName,
      designCode: item.product.designCode,
      metalType: item.metalType,
      customFinish: item.customFinish,
      quantityBand: item.quantityBand
    }));

    // 3. Create the Order/Enquiry in the Database
    const newOrder = await Order.create({
      userId: userId || null,
      contactDetails,
      items: orderItems
    });

    // 4. Clear the Cart after successful submission
    cart.items = [];
    await cart.save();

    // ---------------------------------------------------------
    // VERCEL FIX: SEND RESPONSE IMMEDIATELY
    // ---------------------------------------------------------
    // We send the 201 Success back to the frontend right now.
    // This stops the frontend from hanging on "Submitting..."
    res.status(201).json({ 
      success: true, 
      message: "Price request submitted successfully!", 
      data: newOrder 
    });

    // ---------------------------------------------------------
    // ATTEMPT TO SEND EMAIL (SILENT FAIL IF IT CRASHES)
    // ---------------------------------------------------------
    try {
      let itemsHtml = `<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f1f1f1; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Design Code</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Metal & Finish</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
          </tr>
        </thead>
        <tbody>`;

      orderItems.forEach(item => {
        itemsHtml += `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.productName}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.designCode}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.metalType} (${item.customFinish})</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.quantityBand}</td>
          </tr>
        `;
      });
      itemsHtml += `</tbody></table>`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-w: 700px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #0082A4;">New Wholesale Order / Price Request 🛍️</h2>
          <p>A client has submitted their cart for a wholesale pricing request.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <h3 style="color: #333; margin-bottom: 5px;">Client Details:</h3>
          <p><strong>Name:</strong> ${contactDetails.fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${contactDetails.email}">${contactDetails.email}</a></p>
          <p><strong>WhatsApp:</strong> ${contactDetails.whatsappNo}</p>
          <p><strong>Company:</strong> ${contactDetails.companyName || "N/A"} ${contactDetails.companyWebsite ? `(<a href="${contactDetails.companyWebsite}">${contactDetails.companyWebsite}</a>)` : ""}</p>
          <p><strong>Country:</strong> ${contactDetails.country}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold;">Client Message:</p>
            <p style="margin-top: 5px; white-space: pre-wrap;">${contactDetails.message}</p>
          </div>

          <h3 style="color: #333; margin-top: 30px; margin-bottom: 5px;">Requested Items:</h3>
          ${itemsHtml}
          
          <br/><br/>
          <a href="${process.env.FRONTEND_URL}/admin/orders" style="display: inline-block; background-color: #0082A4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Request in Admin Panel</a>
        </div>
      `;

      await sendEmail({
        subject: `New Cart Request from ${contactDetails.fullName}`,
        html: emailHtml,
      });

    } catch (emailError) {
      // If Vercel/Gmail blocks the email, we log it, but the user is already on the Success page!
      console.error("Non-Fatal Error: Order saved, but email failed to send:", emailError);
    }

  } catch (error) {
    console.error("Order Submit Error:", error);
    // Only send the 500 error if we haven't already sent the 201 Success
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Failed to submit request" });
    }
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    res.status(200).json({ success: true, data: order });
  } catch (error) { 
    res.status(500).json({ success: false }); 
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: order });
  } catch (error) { res.status(500).json({ success: false }); }
};