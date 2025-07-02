const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Story = require("../models/story");
const User = require("../models/userModel");
const cron = require("node-cron");
const router = express.Router();

// Middleware for handling file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API endpoint to create a story
router.post("/create", upload.single("file"), async (req, res) => {
  const { contentType, textContent } = req.body;
  const userId = req.user.id; // Assume you're extracting user ID from the authenticated token
  const file = req.file;
  
  try {
    // Handle file upload to Cloudinary
    let contentUrl = "";
    
    if (contentType === "image" || contentType === "video") {
      const uploadResponse = await cloudinary.uploader.upload_stream({
        resource_type: contentType === "video" ? "video" : "image",
        public_id: `stories/${userId}/${Date.now()}`, // Optional: To organize stories by user
      }, (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Failed to upload file to Cloudinary" });
        }
        contentUrl = result.secure_url;
      });

      file.buffer.pipe(uploadResponse); // Upload file buffer to Cloudinary

    } else if (contentType === "text") {
      contentUrl = null;
    }

    // Set the expiration time to 24 hours from now
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);  // 24 hours

    const newStory = new Story({
      userId,
      contentType,
      contentUrl,
      textContent,
      expirationTime,
    });

    await newStory.save();

    res.status(201).json({ message: "Story created successfully", story: newStory });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating story" });
  }
});

// API endpoint to fetch stories (only followers)
router.get("/stories", async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from the authenticated token
  
      // Find the user's followers
      const user = await User.findById(userId).populate("followers");
      const followersIds = user.followers.map(follower => follower._id);
  
      // Get stories visible to this user
      const stories = await Story.find({
        userId: { $in: followersIds },
        expirationTime: { $gte: new Date() },  // Only stories that haven't expired
      });
  
      res.status(200).json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching stories" });
    }
  });
  



// Delete stories that are older than 24 hours every hour
cron.schedule("0 * * * *", async () => {
  try {
    await Story.deleteMany({ expirationTime: { $lt: new Date() } });
    console.log("Expired stories deleted.");
  } catch (err) {
    console.error("Error deleting expired stories:", err);
  }
});


module.exports = router;
