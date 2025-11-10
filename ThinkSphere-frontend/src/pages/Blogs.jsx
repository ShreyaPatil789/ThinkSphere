import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BlogSearchSection from "./BlogSearchSection"; // Add this
import BlogCard from "./BlogCard";
import "./Blogs.css";
import { FaBell } from 'react-icons/fa';
import { API_BASE_URL } from "../config";

const Blogs = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To extract search parameters from URL

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // To handle search term

  const validCategories = ["All", "Travelling", "Technology", "Human Life", "Other"];
  const safeCategory = validCategories.includes(category) ? category : "all";

  // Extract search term from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchTerm(queryParams.get("search") || "");
  }, [location]);

  // Fetch blogs based on category
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          category === "all"
            ? `${API_BASE_URL}/api/blogs?search=${searchTerm}`
            : `${API_BASE_URL}/api/blogs?category=${category}&search=${searchTerm}`
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category, searchTerm]);

  return (
    <div className="wrapper">
      <div className="blogs-navbar">
        <div className="navbar-left">
          <h1 className="site-name" onClick={() => navigate("/")}>ThinkSphere</h1>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/ProfilePage")}>Profile</button>
          <button onClick={() => navigate("/create-blog")}>Create Blog</button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
          <button className="notification-icon" onClick={() => navigate("/notifications")} style={{ cursor: 'pointer' }}>
            <FaBell size={30} />
          </button>
        </div>
      </div>

      <div className={`blogs-container blogs-${safeCategory}`}>
        <h2 className="blogs-title">
          {safeCategory === "all"
            ? "All Blogs"
            : `${safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1)} Blogs`}
        </h2>

        {searchTerm && (
          <h3 className="search-heading">
            Showing results for: <span className="search-term">"{searchTerm}"</span>
          </h3>
        )}

        <BlogSearchSection onResults={setBlogs} />

        {loading ? (
          <p className="loading-text">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="no-blogs-text">No blogs found.</p>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
