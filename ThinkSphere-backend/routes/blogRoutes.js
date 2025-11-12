const express = require("express");
const Blog = require("../models/blogModel");
const { authenticateUser, authorizeOwnerOrAdmin } = require("../middleware/authMiddleware");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const { uploadBlogImage } = require("../middleware/uploadMiddleware");


const router = express.Router();

// 🔹 Get all blogs (Public)

const Comment = require("../models/commentModel");


router.get("/liked-blogs", authenticateUser, async (req, res) => {
  try {
    console.log("✅ [ROUTE HIT] GET /liked-blogs");
    
    if (!req.user || !req.user._id) {
      console.error("❌ User not found in request object");
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    const userId = req.user._id;
    console.log("👉 Authenticated User ID:", userId);

    const blogs = await Blog.find({ likes: userId })
  .populate("user", "username profileImage")
  .sort({ createdAt: -1 });


    console.log(`✅ Blogs fetched for liked user: ${blogs.length}`);
    res.status(200).json(blogs);
  } catch (error) {
    console.error("🔥 Error in /liked-blogs route:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = {};

    // Apply category filter if present and not "all"
    if (category && category !== "all") {
      query.category = category;
    }

    // Apply title search if provided
    if (search) {
      query.title = { $regex: search, $options: "i" }; // case-insensitive title match
    }

    const blogs = await Blog.find(query)
      .populate("user", "username profileImage")
      .lean();

      console.log("Blogs:", blogs);
      
    const blogsWithCommentCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return { ...blog, commentCount };
      })
    );

    res.status(200).json(blogsWithCommentCounts);
  } catch (error) {
    console.error("Blog fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.get("/:id", async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id).populate("user", "username");
      if (!blog) return res.status(404).json({ message: "Blog not found" });
  
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  


// 🔹 Get public profile by user ID
router.get("/public-profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("username profileImage bio");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});


  
// 🔹 Create a new blog (Only Authenticated Users)
router.post("/", authenticateUser, uploadBlogImage.single("image"), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageUrl = req.file?.path || null;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      category,
      user: req.user._id,
      image: imageUrl,
    });

    await blog.save();
    console.log("🖼️ Uploaded file:", req.file);
    // 🔔 Create notification for new blog (for followers or admin)
    // Optional: You can add notification here too

    // 🔔 Create notification only if the blog is created for someone else (optional)
    if (blog.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: blog.user,
        sender: req.user._id,
        type: "like",
        blog: blog._id,
        message: `${req.user.username} liked your blog: ${blog.title}`,
      });
    }

    res.status(201).json(blog);
  } catch (error) {
    console.error("❌ Full error object:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// 🔹 Update a blog (Only Owner or Admin)
router.put("/:id", authenticateUser, authorizeOwnerOrAdmin(Blog), uploadBlogImage.single("image"), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const image = req.file?.path;

    const updateFields = { title, content };
    if (category) updateFields.category = category;
    if (image) updateFields.image = image;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Delete a blog (Only Owner or Admin)
router.delete("/:id", authenticateUser, authorizeOwnerOrAdmin(Blog), async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// Like/Unlike a blog
router.put("/:id/like", authenticateUser, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const alreadyLiked = blog.likes.includes(req.user._id);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();
    console.log("✅ Blog likes after toggle:", blog.likes);

    // ✅ Notification logic inside try block
    if (!alreadyLiked && blog.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: blog.user,
        sender: req.user._id,
        type: "like",
        blog: blog._id,
        message: `${req.user.username} liked your blog: ${blog.title}`,
      });
    }

    res.json({ message: "Like updated!", likes: blog.likes });
  } catch (error) {
    console.error("🔥 Error in like route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

 
// 🔹 Get blogs by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.userId })
    .populate("user", "username profileImage")
    .sort({ createdAt: -1 });
  
    if (!blogs) return res.status(404).json({ message: "No blogs found for this user" });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


  
// Get like count
router.get("/:id/likes", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.json({ likes: blog.likes.length });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});



router.get("/:id/like-status", authenticateUser, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const userId = req.user._id; // Get logged-in user ID
        const liked = blog.likes.includes(userId); // Check if user liked it

        res.json({ liked });
    } catch (error) {
        res.status(500).json({ message: "Error checking like status" });
    }
});

  
router.get("/my-blogs", authenticateUser, async (req, res) => {
    try {
      const blogs = await Blog.find({ user: req.user._id })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });
    
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
