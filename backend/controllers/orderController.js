const Order = require("../models/Order");
const Cart = require("../models/Cart");
const sendEmail = require("../utils/sendEmail");
const ExcelJS = require("exceljs"); 
const sizeOf = require("image-size"); // <-- IMPORT IMAGE SIZE LIBRARY

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
      imageUrl: item.product.imageUrl, 
      metalType: item.metalType,
      customFinish: item.customFinish,
      quantityBand: item.quantityBand
    }));

    // 3. Generate a Sequential Order Number
    const orderCount = await Order.countDocuments();
    const orderSerialNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    // 4. Create the Order/Enquiry in Database
    const newOrder = await Order.create({
      userId: userId || null,
      contactDetails,
      items: orderItems
    });

    // 5. Clear the Cart after successful submission
    cart.items = [];
    await cart.save();

    // ---------------------------------------------------------
    // SEND RESPONSE IMMEDIATELY
    // ---------------------------------------------------------
    res.status(201).json({ 
      success: true, 
      message: "Price request submitted successfully!", 
      data: newOrder 
    });

    // ---------------------------------------------------------
    // GENERATE EXCEL WITH INLINE IMAGES & EMAIL (Background Worker)
    // ---------------------------------------------------------
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(`Quote Request ${orderSerialNumber}`);

      // Setup sheet columns
      sheet.columns = [
        { header: 'Product Name', key: 'name', width: 25 },
        { header: 'Design Code', key: 'code', width: 15 },
        { header: 'Metal Type', key: 'metal', width: 15 },
        { header: 'Custom Finish', key: 'finish', width: 20 },
        { header: 'Quantity Range', key: 'qty', width: 18 },
        { header: 'Product Image', key: 'image', width: 22 }, // Column F
        { header: 'Unit Price (Fill Here)', key: 'price', width: 25 },
        { header: 'Total Price (Fill Here)', key: 'total', width: 25 }
      ];

      // Insert Customer Details
      sheet.insertRow(1, ['--- CUSTOMER DETAILS ---']);
      sheet.insertRow(2, ['Order Number:', orderSerialNumber]);
      sheet.insertRow(3, ['Name:', contactDetails.fullName]);
      sheet.insertRow(4, ['Email:', contactDetails.email]);
      sheet.insertRow(5, ['WhatsApp:', contactDetails.whatsappNo]);
      sheet.insertRow(6, ['Company:', contactDetails.companyName || "N/A"]);
      sheet.insertRow(7, ['Country:', contactDetails.country]);
      sheet.insertRow(8, ['Message:', contactDetails.message]);
      sheet.insertRow(9, []); 
      sheet.insertRow(10, ['--- PRODUCT DETAILS ---']);
      
      // Format headers
      sheet.getRow(11).font = { bold: true };
      sheet.getRow(11).height = 24;
      sheet.getRow(11).eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // Loop through items and add rows dynamically
      for (const item of orderItems) {
        // Add text data first
        const addedRow = sheet.addRow({
          name: item.productName,
          code: item.designCode,
          metal: item.metalType,
          finish: item.customFinish,
          qty: item.quantityBand,
          price: '', 
          total: ''  
        });

        const currentRowNumber = addedRow.number; 

        // FIX 1: Increase Row height strictly to 100 points (~133 pixels)
        addedRow.height = 100; 
        addedRow.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });
        addedRow.getCell('name').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        // Fetch and inject Image with Aspect Ratio Preservation
        if (item.imageUrl) {
          try {
            const imageFetchResponse = await fetch(item.imageUrl);
            
            if (imageFetchResponse.ok) {
              const arrayBuffer = await imageFetchResponse.arrayBuffer();
              const binaryBuffer = Buffer.from(arrayBuffer);

              // 1. Get exact dimensions of the fetched image
              let dimensions;
              try {
                dimensions = sizeOf(binaryBuffer);
              } catch (e) {
                dimensions = { width: 100, height: 100 }; // Fallback if format is unreadable
              }

              // FIX 2: Restrict Max Image Pixel size to 100x100 to easily fit inside the 133px row
              const maxWidth = 100;
              const maxHeight = 100;
              const ratio = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height);
              
              const scaledWidth = Math.round(dimensions.width * ratio);
              const scaledHeight = Math.round(dimensions.height * ratio);

              // 3. Define extension
              let inferredExtension = 'jpeg';
              if (item.imageUrl.toLowerCase().endsWith('.png')) inferredExtension = 'png';
              if (item.imageUrl.toLowerCase().endsWith('.gif')) inferredExtension = 'gif';

              // 4. Register image in the workbook
              const registeredImageId = workbook.addImage({
                buffer: binaryBuffer,
                extension: inferredExtension
              });

              // 5. Inject using `ext` (exact pixels)
              sheet.addImage(registeredImageId, {
                tl: { col: 5.2, row: currentRowNumber - 0.9 }, // Slight padding to push it down/right into the cell
                ext: { width: scaledWidth, height: scaledHeight }, // Lock exact pixel aspect ratio
                editAs: 'oneCell'
              });
            } else {
              sheet.getCell(`F${currentRowNumber}`).value = "Image Not Found";
            }
          } catch (fetchError) {
            console.error(`Failed to compile image for row ${currentRowNumber}:`, fetchError);
            sheet.getCell(`F${currentRowNumber}`).value = "Image Error";
          }
        }
      }

      // Generate Buffer for email attachment
      const outputWorkbookBuffer = await workbook.xlsx.writeBuffer();

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-w: 700px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #0082A4;">New Wholesale Order / Price Request 🛍️</h2>
          <p>A client has submitted their cart for a wholesale pricing request.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <h3 style="color: #333; margin-bottom: 5px;">Client Details:</h3>
          <p><strong>Order Reference:</strong> ${orderSerialNumber}</p>
          <p><strong>Name:</strong> ${contactDetails.fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${contactDetails.email}">${contactDetails.email}</a></p>
          <p><strong>WhatsApp:</strong> ${contactDetails.whatsappNo}</p>
          <p><strong>Company:</strong> ${contactDetails.companyName || "N/A"} ${contactDetails.companyWebsite ? `(<a href="${contactDetails.companyWebsite}">${contactDetails.companyWebsite}</a>)` : ""}</p>
          <p><strong>Country:</strong> ${contactDetails.country}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold;">Client Message:</p>
            <p style="margin-top: 5px; white-space: pre-wrap;">${contactDetails.message}</p>
          </div>

          <p style="margin-top: 25px; font-size: 14px; color: #555;">
            <strong>📎 Attached Spreadsheet:</strong> Open the attached Excel file <code>Quote_Request_${orderSerialNumber}.xlsx</code> to view full inline image designs. Fill out the pricing column structure manually and return it to your buyer.
          </p>
          
          <br/>
          <a href="${process.env.FRONTEND_URL}/admin/orders" style="display: inline-block; background-color: #0082A4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Request in Admin Panel</a>
        </div>
      `;

      await sendEmail({
        subject: `New Cart Request [${orderSerialNumber}] from ${contactDetails.fullName}`,
        html: emailHtml,
        attachments: [
          {
            filename: `Quote_Request_${orderSerialNumber}.xlsx`,
            content: outputWorkbookBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        ]
      });

    } catch (emailError) {
      console.error("Non-Fatal Error: Record successfully saved but excel attachment module failed:", emailError);
    }

  } catch (error) {
    console.error("Order Submit Error:", error);
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

// Admin: Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};