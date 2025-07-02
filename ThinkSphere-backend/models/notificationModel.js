// models/notificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who gets notified
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who did the action
  type: { type: String, enum: ["like", "comment", "new_blog"], required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }, // Optional: related blog
  message: { type: String }, // Optional: custom message
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
