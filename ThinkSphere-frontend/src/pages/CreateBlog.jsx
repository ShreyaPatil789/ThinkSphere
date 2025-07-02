import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css"
const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("travel");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog created successfully!");
      navigate(`/blogs/${category}`); // Redirect to blog category page
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Failed to create blog");
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-form">
        <h2>Create a New Blog</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
  
  <textarea
  name="content"
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows="10"
  placeholder="Write your blog here. Use Enter for paragraphs."
/>


  
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Travelling">Travel</option>
            <option value="Technology">Technology</option>
            <option value="Human Life">Human Life</option>
            <option value="Other">Other</option>
          </select>
  
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
  
          <button type="submit">Publish Blog</button>
        </form>
      </div>
    </div>
  );
};  

export default CreateBlog;
