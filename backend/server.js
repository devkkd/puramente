require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// <-- IMPORT USER MODEL FOR ADMIN AUTO-CREATION -->
const User = require("./models/User"); 

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
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

// ✅ ROUTES IMPORTS
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes"); 
const orderRoutes = require("./routes/orderRoutes");
const customRequestRoutes = require("./routes/customRequestRoutes");
const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const instaRoutes = require("./routes/instaRoutes");

// ✅ MOUNT ROUTES
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

// --- AUTO-CREATE ADMIN ACCOUNT SCRIPT ---
const createDefaultAdmin = async () => {
  try {
    // ⚠️ CHANGE THESE TO YOUR PREFERRED ADMIN CREDENTIALS
    const adminEmail = "admin@puramente.com";
    const adminPassword = "securepassword123"; 

    // Check if the admin already exists so we don't recreate it on every server restart
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      await User.create({
        fullName: "Puramente Owner",
        email: adminEmail,
        password: adminPassword, // Your User model's pre-save hook will hash this!
        isAdmin: true            // Grants admin access
      });
      console.log("✅ Default Admin account created automatically.");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log("✅ MongoDB connected");
  // Call the admin creation function AFTER the database is connected
  createDefaultAdmin();
}).catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});