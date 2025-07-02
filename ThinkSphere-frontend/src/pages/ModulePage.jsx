import React from "react";
import { useNavigate } from "react-router-dom";
import "./ModulePage.css"; // External CSS file

const modules = [
  { name: "All Blogs", image: "/allbogs.jpg", description: "Explore a variety of blogs from different topics.", path: "/blogs/all" },
  { name: "Travel Blogs", image: "/travelling.jpg", description: "Discover amazing travel stories and guides.", path: "/blogs/travel" },
  { name: "Technology Blogs", image: "/technology.jpg", description: "Stay updated with the latest tech trends.", path: "/blogs/technology" },
  { name: "Human-Life Blogs", image: "humanlife.jpg", description: "Read deep insights about life and experiences.", path: "/blogs/human-life" }
];

const ModulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="modules-container">
      <div className="top-bar">
        <div className="marquee-container">
          <div className="marquee-text">ThinkSphere ...let your inner voice Speakout !!!</div>
        </div>
        
        <button className="profile-btn" onClick={() => navigate("/ProfilePage")}>Profile</button>
        <button className="logout-btn" onClick={() => navigate("/logout")}>Logout</button>
      </div>

      <h2 className="page-title">Select The Blog Category</h2>
      
      <div className="modules-grid">
        {modules.map((module, index) => (
          <div key={index} className="module-card">
            <img src={module.image} alt={module.name} className="module-image" />
            <h3 className="module-name">{module.name}</h3>
            <p className="module-description">{module.description}</p>
            <button className="view-blogs-btn" onClick={() => navigate(module.path)}>View Blogs</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesPage;
