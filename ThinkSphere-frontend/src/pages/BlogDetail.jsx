import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css";
import { API_BASE_URL } from "../config";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found.</p>;
  
  console.log("Blog image:", blog.image); 
  return (
    <div className="blog-detail-container">
      <h2 >{blog.title}</h2>
      <p className="author"><strong>Author:</strong> {blog.user.username}</p>
     
      
{blog.image && (
  <img
    src={blog.image}
    alt={blog.title}
    className="blog-image"
  />
)}
     <div className="blog-content">
  {blog.content.split('\n').map((para, index) => (
    <p key={index} style={{ marginBottom: '1rem' }}>
      {para.trim()}
    </p>
  ))}
</div>

    </div>
  );
};

export default BlogDetail;
