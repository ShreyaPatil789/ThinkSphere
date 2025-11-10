import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateBlog.css"; // Reuse the same CSS
import { API_BASE_URL } from "../config";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    category: "Travelling",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);
    formData.append("category", blog.category);
    if (newImage) formData.append("image", newImage);

    try {
      await axios.put(`${API_BASE_URL}/api/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog updated!");
      navigate(`/blogs/${blog.category}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update blog");
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-form">
        <h2>Edit Blog</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <input
            type="text"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            placeholder="Title"
            required
          />

          <textarea
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            placeholder="Content"
            rows={10}
            required
          />

          <select value={blog.category} onChange={(e) => setBlog({ ...blog, category: e.target.value })}>
            <option value="Travelling">Travel</option>
            <option value="Technology">Technology</option>
            <option value="Human Life">Human Life</option>
            <option value="Other">Other</option>
          </select>

          <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />

          <button type="submit">Update Blog</button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
