const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // ✅ Correct Import
 // ✅ Correct Import


// Middleware to verify token and attach user info to request
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log("Authorization Header:", authHeader); // ✅ Debugging

        const token = authHeader?.split(" ")[1]; // Extract token from header
        console.log("Extracted Token:", token); // ✅ Debugging

        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // ✅ Debugging

        req.user = await User.findById(decoded.userId).select("-password"); // Fetch user from DB
        console.log("User after token verification:", req.user); // ✅ Debugging

        if (!req.user) return res.status(401).json({ message: "User not found." });

        next();
    } catch (err) {
        console.error("Invalid Token Error:", err.message); // ✅ Debugging
        res.status(400).json({ message: "Invalid token." });
    }
};

// Middleware to check admin access
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

// Middleware to check if user owns the blog
const authorizeOwnerOrAdmin = (Model) => async (req, res, next) => {
    try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });

        // Allow access if user is admin or owns the blog
        if (req.user.role === "admin" || item.user.toString() === req.user.id) {
            return next();
        }

        return res.status(403).json({ message: "Access denied." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { authenticateUser, authorizeAdmin, authorizeOwnerOrAdmin };