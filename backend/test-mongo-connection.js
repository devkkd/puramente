require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Testing MongoDB Connection...\n");

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}

console.log("📍 Connection String:", mongoUri.substring(0, 60) + "...");
console.log("");

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    console.log("");
    console.log("📊 Connection Details:");
    console.log("   - Ready State:", mongoose.connection.readyState);
    console.log("   - Host:", mongoose.connection.host);
    console.log("   - Database:", mongoose.connection.name);
    console.log("");
    console.log("🎉 Backend is ready to start!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed!");
    console.error("");
    console.error("Error Message:", err.message);
    console.error("");
    console.error("🔧 Troubleshooting Tips:");
    
    if (err.message.includes("getaddrinfo")) {
      console.error("   → Network DNS issue: Check internet connection");
    } else if (err.message.includes("ECONNREFUSED")) {
      console.error("   → Connection refused: Check IP whitelist in MongoDB Atlas");
      console.error("   → Go to: https://cloud.mongodb.com → Network Access → IP Whitelist");
    } else if (err.message.includes("authentication failed")) {
      console.error("   → Auth failed: Check username/password in .env");
    } else if (err.message.includes("ETIMEDOUT")) {
      console.error("   → Timeout: IP likely not whitelisted in MongoDB Atlas");
    }
    
    process.exit(1);
  });