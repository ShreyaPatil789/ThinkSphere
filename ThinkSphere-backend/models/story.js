const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: true,
  },
  contentType: {
    type: String,
    enum: ["image", "video", "text"],
    required: true,
  },
  contentUrl: {
    type: String, // URL of the image/video from Cloudinary
    required: true,
  },
  textContent: {
    type: String, // If the content is text, store it here
    required: false,
  },
  expirationTime: {
    type: Date,
    required: true,
  },
  followersOnly: {
    type: Boolean,
    default: true, // Default is to make it visible to followers only
  }
}, { timestamps: true });

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
