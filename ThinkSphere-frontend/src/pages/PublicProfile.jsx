import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css"; // Reuse your existing styles
import { API_BASE_URL } from "../config";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchLoggedInUser();
    fetchPublicUserProfile();
  }, [userId]);

  // Fetch logged in user info
  const fetchLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLoggedInUserId(data._id);
    checkIfFollowing(token);

   
  };

  // Check if logged in user is following the public profile user
  const checkIfFollowing = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/is-following/${userId}`
        , {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch follow status");
      }
  
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };
  
  // Fetch public profile and blogs
  const fetchPublicUserProfile = async () => {
    try {
      const userRes = await fetch(`${API_BASE_URL}/api/blogs/public-profile/${userId}`);
      const userData = await userRes.json();
      setUser(userData);

      const blogsRes = await fetch(`${API_BASE_URL}/api/blogs/user/${userId}`);
      const blogsData = await blogsRes.json();
      setUserBlogs(blogsData);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching public profile:", err);
      setError("Failed to load profile.");
      setLoading(false);
    }
  };

  // Handle follow action
  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE_URL}/api/auth/follow/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(true);
    } catch (err) {
      console.error("Follow failed:", err);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE_URL}/api/auth/unfollow/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
    } catch (err) {
      console.error("Unfollow failed:", err);
    }
  };

  // Handle loading and error states
  if (loading) return <div className="loading">Loading Profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        <ul>
          <li onClick={() => navigate("/blogs/all")}>Home 🏠</li>
          <li onClick={() => navigate("/blogs/all")}>Search 🔍</li>
          <li onClick={() => navigate("/ModulePage")}>Explore 🗺️</li>
          <li onClick={() => navigate("/create-blog")}>Create ✍🏼</li>
          <li onClick={() => navigate("/notifications")}>Notifications 🔔</li>
        </ul>
      </div>

      <div className="profile-main">
        <div className="profile-header">
          <div className="profile-image-container">
            <img src={user.profileImage || "/default1.jpg"} alt="Profile" className="profile-img" />
          </div>
          <div className="profile-info">
            <h2>{user.username || "Unknown"}</h2>
            <p className="bio">{user.bio || "No bio provided."}</p>
            <div>
              {loggedInUserId !== user._id && (
                isFollowing ? (
                  <button onClick={handleUnfollow} className="follow-btn unfollow">Unfollow</button>
                ) : (
                  <button onClick={handleFollow} className="follow-btn follow">Follow</button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="blog-grid">
          {userBlogs.length === 0 ? (
            <p className="no-blogs">No blogs published yet.</p>
          ) : (
            userBlogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <img src={blog.image} alt={blog.title} />
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 100)}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
