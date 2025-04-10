const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Auth Middleware - Token received:", token); // Debug log
  
  if (!token) {
    console.log("No token provided - rejecting request");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log
    
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ message: "Invalid token - user not found" });
    }
    
    console.log("User attached to req.user:", req.user); // Debug log
    next();
  } catch (err) {
    console.error("Token verification error:", err.message); // Debug log
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;