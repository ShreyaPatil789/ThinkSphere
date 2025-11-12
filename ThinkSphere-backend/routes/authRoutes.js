const express = require("express");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware"); // Import middleware
const { uploadProfileImage } = require("../middleware/uploadMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); 
const Blog = require("../models/blogModel"); 

const router = express.Router();

// User Registration Route
// User Registration Route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        
        
        const newUser = new User({ 
            username, 
            email, 
            password,  // Pass raw password, let pre("save") hook hash it
            role: role || "user" 
        });

        await newUser.save(); // pre("save") hook will hash it before storing
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("❌ Error in Registration:", error);
        if (error && error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(400).json({ error: `${field} already exists` });
        }
        res.status(500).json({ error: "Server error" });
    }
});


// User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

       

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h", algorithm: "HS256" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { _id: user._id, username: user.username, email: user.email, role: user.role },
        });

    } catch (error) {
        console.error("Error in login route:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
});



// Test Admin Route - Only Admins Can Access
router.get("/admin/test", authenticateUser, authorizeAdmin, (req, res) => {
    res.status(200).json({ message: "Admin access granted!" });
});

router.put("/profile/update", authenticateUser, async (req, res) => {
    try {
        const { username, email, oldPassword, password, bio, profileImage } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ error: "User not found" });

        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) user.profileImage = profileImage;

        if (password) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully!", user });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// follow unfollow 
// Follow a user
router.post("/follow/:userId", authenticateUser, async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const userToFollow = req.params.userId;
  
      if (loggedInUser === userToFollow) {
        return res.status(400).json({ error: "You cannot follow yourself." });
      }
  
      const user = await User.findById(userToFollow);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if already following
      if (user.followers.includes(loggedInUser)) {
        return res.status(400).json({ error: "You are already following this user." });
      }
  
      // Add to followers of the user and following of the logged-in user
      user.followers.push(loggedInUser);
      await user.save();
  
      const loggedInUserObj = await User.findById(loggedInUser);
      loggedInUserObj.following.push(userToFollow);
      await loggedInUserObj.save();
  
      res.status(200).json({ message: "Successfully followed the user!" });
  
    } catch (err) {
      console.error("Error following user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Unfollow a user
  router.post("/unfollow/:userId", authenticateUser, async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const userToUnfollow = req.params.userId;
  
      const user = await User.findById(userToUnfollow);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the user is already unfollowed
      if (!user.followers.includes(loggedInUser)) {
        return res.status(400).json({ error: "You are not following this user." });
      }
  
      // Remove from followers of the user and following of the logged-in user
      user.followers.pull(loggedInUser);
      await user.save();
  
      const loggedInUserObj = await User.findById(loggedInUser);
      loggedInUserObj.following.pull(userToUnfollow);
      await loggedInUserObj.save();
  
      res.status(200).json({ message: "Successfully unfollowed the user!" });
  
    } catch (err) {
      console.error("Error unfollowing user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Check if the logged-in user is following a specific user
  router.get("/is-following/:userId", authenticateUser, async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const userToCheck = req.params.userId;
  
      const user = await User.findById(userToCheck);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isFollowing = user.followers.includes(loggedInUser);
      res.status(200).json({ isFollowing });
  
    } catch (err) {
      console.error("Error checking follow status:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  //following followers logic 

  // Fetch followers
router.get("/followers", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const user = await User.findById(loggedInUser).populate("followers");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.followers);
  } catch (err) {
    console.error("Error fetching followers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch following
router.get("/following", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const user = await User.findById(loggedInUser).populate("following");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.following);
  } catch (err) {
    console.error("Error fetching following:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/profile/upload-image", authenticateUser, uploadProfileImage.single("profileImage"), async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      user.profileImage = req.file.path; // Cloudinary URL
      await user.save();
  
      res.status(200).json({ message: "Profile image updated", imageUrl: user.profileImage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
});

// ✅ NEW: Get Profile Info for displaying on page reload
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("username email bio profileImage");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/logout", authenticateUser, (req, res) => {
    res.status(200).json({ message: "Logged out successfully!" });
});

// ✅ Check Authentication Status
router.get("/check-auth", authenticateUser, (req, res) => {
    res.status(200).json({ message: "User is authenticated", user: req.user });
});





router.delete("/delete", authenticateUser, async (req, res) => {
    try {
        const userId = req.user._id;

        // 🔸 Delete all blogs by this user (optional)
        await Blog.deleteMany({ user: userId });

        // 🔸 Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;
