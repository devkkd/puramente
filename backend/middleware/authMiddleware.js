const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

      // Check if it's the hardcoded admin token
      if (decoded.role === "admin") {
        req.user = { id: "admin_hardcoded_id", role: "admin" };
        return next();
      }

      // Otherwise, look for a normal user in the database
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) throw new Error("User not found");

      next();
    } catch (error) {
      return res.status(401).json({ success: false, error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized, no token provided" });
  }
};

exports.admin = (req, res, next) => {
  // Check the role we set in the protect middleware
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
};