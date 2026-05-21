const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

// 1. Configure Multer with strict size limits
// Videos max 50MB, Images max 5MB (logic enforced in fileFilter and helper)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // Absolute limit: 50MB
  },
  fileFilter: (req, file, cb) => {
    // Only allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and videos are allowed."), false);
    }
  }
});

// 2. Configure S3 Client for Cloudflare R2
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

// 3. Helper function to upload buffer to R2 with size validation
const uploadToCloudflare = async (file) => {
  // Validate Image size specifically (5MB limit)
  if (file.mimetype.startsWith('image/') && file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be 5MB or less.");
  }

  // Generate a unique filename
  const fileName = `${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);
  
  // Clean URL base
  const baseUrl = process.env.CLOUDFLARE_PUBLIC_URL.replace(/\/$/, "");
  return `${baseUrl}/${fileName}`;
};

module.exports = { upload, uploadToCloudflare };