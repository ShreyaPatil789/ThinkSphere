const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

connectDB();

const app = express();
app.use(express.json());
app.use(cors());



// Serve images from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
// or whatever the correct path is

// Load Routes
const authRoutes = require("./routes/authRoutes");  
app.use("/api/auth", authRoutes);


app.use("/api/notifications", require("./routes/notificationRoutes"));

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin",adminRoutes);

const storyRoutes = require('./routes/storyRoutes');
app.use('/api/stories', storyRoutes);


// Default Route
app.get("/", (req, res) => {
    res.send("ThinkSphere API is running...");
});

// Handle 404 Errors
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// Set Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
