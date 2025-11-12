const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();

connectDB();

const app = express();
app.use(express.json());

// Configure CORS to allow multiple frontends
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://think-sphere-delta.vercel.app/",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Serve images from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
