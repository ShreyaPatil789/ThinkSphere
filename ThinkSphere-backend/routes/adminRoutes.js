const express = require("express");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");
const User = require("../models/userModel");


const router = express.Router();

// ✅ Get all users (Admin Only)
router.get("/users", authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Delete a user (Admin Only)
router.delete("/users/:id", authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
