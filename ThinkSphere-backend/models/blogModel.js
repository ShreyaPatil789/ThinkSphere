const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
