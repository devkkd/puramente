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

      // Column layout (0-indexed): A=sr, B=name, C=code, D=image, E=finish, F=metal, G=qty, H=price, I=total
      sheet.columns = [
        { key: 'sr',     width: 6  }, // A — Sr. No.
        { key: 'name',   width: 28 }, // B — Product Name
        { key: 'code',   width: 16 }, // C — Design Code
        { key: 'image',  width: 22 }, // D — Product Image
        { key: 'finish', width: 22 }, // E — Custom Finish
        { key: 'metal',  width: 16 }, // F — Metal Type
        { key: 'qty',    width: 18 }, // G — Quantity Range
        { key: 'price',  width: 25 }, // H — Unit Price (Fill Here)
        { key: 'total',  width: 25 }, // I — Total Price (Fill Here)
      ];

      // ── Customer Details block (rows 1–9) ──────────────────────────────
      sheet.insertRow(1, ['--- CUSTOMER DETAILS ---']);
      sheet.insertRow(2, ['Order Number:', orderSerialNumber]);
      sheet.insertRow(3, ['Name:',         contactDetails.fullName]);
      sheet.insertRow(4, ['Email:',        contactDetails.email]);
      sheet.insertRow(5, ['WhatsApp:',     contactDetails.whatsappNo]);
      sheet.insertRow(6, ['Company:',      contactDetails.companyName || 'N/A']);
      sheet.insertRow(7, ['Country:',      contactDetails.country]);
      sheet.insertRow(8, ['Message:',      contactDetails.message]);
      sheet.insertRow(9, []);

      // ── "PRODUCT DETAILS" heading row (row 10) — merged across all 9 columns ──
      sheet.insertRow(10, ['PRODUCT DETAILS']);
      const headingRow = sheet.getRow(10);
      headingRow.height = 28;
      headingRow.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
      headingRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
      headingRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0082A4' } };
      // Merge A10:I10 so the heading spans all 9 columns
      sheet.mergeCells('A10:I10');

      // ── Product table column headers (row 11) ──────────────────────────
      const productHeaderRow = sheet.insertRow(11, [
        'Sr.', 'Product Name', 'Design Code', 'Product Image',
        'Custom Finish', 'Metal Type', 'Quantity Range',
        'Unit Price (Fill Here)', 'Total Price (Fill Here)'
      ]);
      productHeaderRow.height = 24;
      productHeaderRow.font = { bold: true };
      productHeaderRow.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };
        cell.border = {
          top:    { style: 'thin' }, bottom: { style: 'thin' },
          left:   { style: 'thin' }, right:  { style: 'thin' }
        };
      });

      // ── Product data rows (row 11 onwards) ────────────────────────────
      for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i];

        // Image column (D) is left empty for text — image overlaid separately
        const addedRow = sheet.addRow({
          sr:     i + 1,
          name:   item.productName,
          code:   item.designCode,
          image:  '',            // D — filled by addImage below
          finish: item.customFinish,
          metal:  item.metalType,
          qty:    item.quantityBand,
          price:  '',
          total:  ''
        });

        const currentRowNumber = addedRow.number;
        addedRow.height = 100; // ~133px — enough room for the image

        addedRow.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top:    { style: 'thin' }, bottom: { style: 'thin' },
            left:   { style: 'thin' }, right:  { style: 'thin' }
          };
        });
        // Product Name left-aligned for readability
        addedRow.getCell('name').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        // ── Inline image in column D (index 3) ─────────────────────────
        if (item.imageUrl) {
          try {
            const imageFetchResponse = await fetch(item.imageUrl);

            if (imageFetchResponse.ok) {
              const arrayBuffer = await imageFetchResponse.arrayBuffer();
              const binaryBuffer = Buffer.from(arrayBuffer);

              let dimensions;
              try {
                dimensions = sizeOf(binaryBuffer);
              } catch {
                dimensions = { width: 100, height: 100 };
              }

              const maxWidth  = 100;
              const maxHeight = 100;
              const ratio = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height);
              const scaledWidth  = Math.round(dimensions.width  * ratio);
              const scaledHeight = Math.round(dimensions.height * ratio);

              let inferredExtension = 'jpeg';
              if (item.imageUrl.toLowerCase().endsWith('.png')) inferredExtension = 'png';
              if (item.imageUrl.toLowerCase().endsWith('.gif')) inferredExtension = 'gif';

              const registeredImageId = workbook.addImage({
                buffer: binaryBuffer,
                extension: inferredExtension
              });

              // Center image inside column D cell
              // Column D width = 22 chars ≈ 165px; row height = 100pt ≈ 133px
              const colWidthPx  = 22 * 7.5;   // ~165px
              const rowHeightPx = 100 * 1.33;  // ~133px

              // Fractional offsets so image lands in the middle of the cell
              const colOffset = (colWidthPx  - scaledWidth)  / 2 / colWidthPx;   // fraction of column width
              const rowOffset = (rowHeightPx - scaledHeight) / 2 / rowHeightPx;  // fraction of row height

              sheet.addImage(registeredImageId, {
                tl: {
                  col: 3 + colOffset,                        // D column (0-indexed) + horizontal centering
                  row: (currentRowNumber - 1) + rowOffset    // data row (0-indexed) + vertical centering
                },
                ext: { width: scaledWidth, height: scaledHeight },
                editAs: 'oneCell'
              });
            } else {
              sheet.getCell(`D${currentRowNumber}`).value = 'Image Not Found';
            }
          } catch (fetchError) {
            console.error(`Failed to compile image for row ${currentRowNumber}:`, fetchError);
            sheet.getCell(`D${currentRowNumber}`).value = 'Image Error';
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