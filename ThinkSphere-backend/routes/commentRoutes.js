const express = require("express");
const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel"); // ✅ This was missing
const { authenticateUser } = require("../middleware/authMiddleware");
const Notification = require("../models/notificationModel");

const router = express.Router();


// 🔹 Create a new comment (Only Authenticated Users)
router.post("/", authenticateUser, async (req, res) => {
  try {
    console.log("Incoming comment data:", req.body);

    const { content, blogId } = req.body;

    if (!content || !blogId) {
      console.error("Missing content or blogId in request body.");
      return res.status(400).json({ message: "Content and blogId are required." });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    let comment = new Comment({
      text: content,
      user: req.user.id,
      blog: blogId,
    });

    await comment.save();
    comment = await comment.populate("user", "username _id");

    // ✅ Create notification (if not commenting on own blog)
    if (blog.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: blog.user,
        sender: req.user._id,
        type: "comment",
        blog: blog._id,
        message: `${req.user.username} commented on your blog: ${blog.title}`,
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

  

// 🔹 Get comments for a blog
router.get("/:blogId", async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId }).populate("user", "username _id");
        res.json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Server error" });
    }
});




// 🔹 Delete a comment (Only Owner or Admin)
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Allow deletion if user is admin or owns the comment
        if (req.user.role === "admin" || comment.user.toString() === req.user.id) {
            await comment.deleteOne();
            return res.json({ message: "Comment deleted successfully" });
        }

        res.status(403).json({ message: "Access denied" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
