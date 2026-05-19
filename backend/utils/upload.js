const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

// 1. Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 2. Configure S3 Client for Cloudflare R2
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

// 3. Helper function to upload buffer to R2
const uploadToCloudflare = async (file) => {
  // Generate a unique filename
  const fileName = `${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);
  
  // FIX: Strip any trailing slashes from the .env variable to prevent // in the URL
  const baseUrl = process.env.CLOUDFLARE_PUBLIC_URL.replace(/\/$/, "");
  return `${baseUrl}/${fileName}`;
};

module.exports = { upload, uploadToCloudflare };