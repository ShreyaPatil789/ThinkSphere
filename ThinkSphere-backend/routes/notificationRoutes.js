// routes/notificationRoutes.js
const express = require("express");
const Notification = require("../models/notificationModel");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "username profileImage")
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/mark-read", authenticateUser, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
