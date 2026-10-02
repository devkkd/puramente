require("dotenv").config();
// Fix for DNS SRV resolution (required for MongoDB Atlas on some systems)
// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://puramentejewel.com",
  "https://www.puramentejewel.com",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed: " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customRequestRoutes = require("./routes/customRequestRoutes");
const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const instaRoutes = require("./routes/instaRoutes");

// MOUNT ROUTES
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/custom-requests", customRequestRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/insta", instaRoutes);

app.get("/", (req, res) => {
  res.send("Puramente API running");
});

// ============================================
// GET USER PUBLIC IP ADDRESS
// ============================================
const getPublicIP = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json", { timeout: 5000 });
    return response.data.ip;
  } catch (err) {
    return null;
  }
};

// ============================================
// MONGODB ATLAS AUTO-WHITELIST (ADMIN API)
// ============================================
const whitelistIPInMongoDB = async (ipAddress, groupId, apiPublicKey, apiPrivateKey) => {
  try {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}/accessList`;
    const auth = Buffer.from(`${apiPublicKey}:${apiPrivateKey}`).toString("base64");
    
    const response = await axios.post(
      url,
      [{ ipAddress: ipAddress, comment: "Auto-whitelisted by Puramente server" }],
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );
    
    console.log("? IP automatically whitelisted in MongoDB Atlas!");
    return true;
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.detail?.includes("already exists")) {
      console.log("? IP already whitelisted");
      return true;
    }
    return false;
  }
};

// ============================================
// MONGODB CONNECTION WITH AUTOMATIC RETRY
// ============================================

let mongoConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 10000;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("? MONGO_URI not found in .env");
    return false;
  }

  connectionAttempts++;
  console.log(`\n?? Connecting to MongoDB... (Attempt ${connectionAttempts}/${MAX_RETRIES})`);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority"
    });
    
    console.log("? MongoDB Connected!");
    mongoConnected = true;
    connectionAttempts = 0;
    return true;

  } catch (err) {
    console.error("? Connection failed:", err.message);
    
    const userIP = await getPublicIP();
    
    if (err.message.includes("ECONNREFUSED") || err.message.includes("querySrv")) {
      if (userIP) {
        console.log(`\n?? Your IP: ${userIP}`);
      }
      
      // Try auto-whitelist if API credentials exist
      const hasAPI = process.env.MONGO_API_PUBLIC_KEY && process.env.MONGO_API_PRIVATE_KEY && process.env.MONGO_GROUP_ID;
      if (hasAPI && userIP && connectionAttempts === 1) {
        console.log("?? Auto-whitelisting IP in MongoDB Atlas...");
        await whitelistIPInMongoDB(userIP, process.env.MONGO_GROUP_ID, process.env.MONGO_API_PUBLIC_KEY, process.env.MONGO_API_PRIVATE_KEY);
      } else if (!hasAPI) {
        console.log("\n?? TO WHITELIST YOUR IP MANUALLY:");
        console.log("   1. Go to https://cloud.mongodb.com");
        console.log("   2. Select cluster: puramentedb");
        console.log("   3. Network Access ? Add IP Address");
        if (userIP) {
          console.log(`   4. Enter: ${userIP}`);
        }
        console.log("   5. Confirm & wait 2-3 minutes");
        console.log("   6. Server will auto-connect\n");
      }
    }

    if (connectionAttempts < MAX_RETRIES) {
      console.log(`? Retry in 10s... (${MAX_RETRIES - connectionAttempts} left)\n`);
      setTimeout(() => connectDB(), RETRY_DELAY);
    } else {
      console.log("? Max retries. Server running WITHOUT database.\n");
      mongoConnected = false;
    }
    return false;
  }
};

connectDB();


// TEST EMAIL ENDPOINT
app.get("/api/test-email", async (req, res) => {
  try {
    const sendEmail = require("./utils/sendEmail");
    console.log("\n?? TEST EMAIL ENDPOINT CALLED");
    
    await sendEmail({
      subject: "?? Puramente Test Email",
      html: `<h1>Test Email Works! ?</h1><p>This is a test email from Puramente backend.</p><p>Time: ${new Date().toISOString()}</p>`
    });
    
    res.json({ success: true, message: "Test email sent - check your inbox!" });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongoConnected: mongoConnected
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n?? Server on port ${PORT}`);
  if (!mongoConnected) console.log("??  MongoDB connecting...\n");
});

process.on("SIGINT", () => {
  if (mongoConnected) mongoose.connection.close();
  server.close();
  process.exit(0);
});

module.exports = { app, mongoConnected };


