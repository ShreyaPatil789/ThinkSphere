import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./BlogSearchSection.css"; // Make sure the CSS is correctly imported

const BlogSearchSection = ({ onResults }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle the search
  const handleSearch = async () => {
    try {
      // Fetch search results and all blogs
      const [searchRes, allRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/blogs?search=${searchQuery}`),
        axios.get(`${API_BASE_URL}/api/blogs`),
      ]);

      // Extract the IDs of the search results
      const searchIds = new Set(searchRes.data.map((blog) => blog._id));

      // Filter out blogs already in the search result from the all blogs list
      const uniqueRest = allRes.data.filter((blog) => !searchIds.has(blog._id));

      // Combine the search results with the remaining blogs
      const finalList = [...searchRes.data, ...uniqueRest]; // search results first

      // Pass the final list to the parent component
      onResults(finalList);
    } catch (error) {
      console.error("Search failed:", error);
      onResults([]); // Clear results in case of error
    }
  };

  return (
    <div className="blog-search-section">
      <input
        type="text"
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search blogs..."
      />
      <button className="search-button" onClick={handleSearch}>
        Search 🔍︎
      </button>
    </div>
  );
};

export default BlogSearchSection;
