import React, { useEffect, useState, useRef } from "react";
import "./ProfilePage.css";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editableUser, setEditableUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("myBlogs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const followersRef = useRef(null);
  const followingRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    console.log("🔄 activeTab changed to:", activeTab);
    if (activeTab === "likedBlogs") {
      console.log("📥 Calling fetchLikedBlogs()");
      fetchLikedBlogs();
    }
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        followersRef.current && !followersRef.current.contains(event.target) &&
        followingRef.current && !followingRef.current.contains(event.target)
      ) {
        setShowFollowers(false);
        setShowFollowing(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchLikedBlogs = async () => {
    const token = localStorage.getItem("token");
    console.log("🎫 Token:", token);

    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/liked-blogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Fetch response status:", res.status);

      if (!res.ok) throw new Error("Failed to fetch liked blogs");

      const data = await res.json();
      console.log("✅ Liked Blogs fetched:", data);
      setLikedBlogs(data);
    } catch (error) {
      console.error("❌ Error fetching liked blogs:", error);
      setError("Failed to load liked blogs. Please try again later.");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUser(data);
      setEditableUser(data);
      const blogsRes = await fetch(`${API_BASE_URL}/api/blogs/user/${data._id}`);
      const blogsData = await blogsRes.json();
      setUserBlogs(Array.isArray(blogsData) ? blogsData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again later.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/api/auth/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editableUser.username,
          bio: editableUser.bio,
          profileImage: editableUser.profileImage,
        }),
      });

      await fetchUserProfile();
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/auth/profile/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setEditableUser((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const fetchFollowers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFollowers(data);
      setShowFollowers(!showFollowers);
      setShowFollowing(false); // Close the other dropdown
    } catch (err) {
      console.error("Error fetching followers", err);
    }
  };

  const fetchFollowing = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFollowing(data);
      setShowFollowing(!showFollowing);
      setShowFollowers(false); // Close the other dropdown
    } catch (err) {
      console.error("Error fetching following", err);
    }
  };


  const handleDelete = async (blogId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId));
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  const handleUpdate = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };
  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li className="active">Profile 👤</li>
          <li onClick={() => navigate("/blogs/all")}>Home 🏠</li>
          <li onClick={()=>navigate("/blogs/all")}>Search 🔍</li>
          <li onClick={() => navigate("/ModulePage")}>Explore 🗺️</li>
          <li onClick={() => navigate("/create-blog")}>Create ✍🏼</li>
          <li onClick={() => navigate("/notifications")}>Notifications 🔔</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={editableUser.profileImage || "/default1.jpg"}
              alt="Profile"
              className="profile-img"
            />
            <label htmlFor="imageInput" className="upload-icon">
              <i className="fas fa-camera"></i>
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          <div className="profile-info">
            {editing ? (
              <>
                <input
                  type="text"
                  value={editableUser.username || ""}
                  onChange={(e) =>
                    setEditableUser({ ...editableUser, username: e.target.value })
                  }
                  placeholder="Enter username"
                />
                <textarea
                  value={editableUser.bio || ""}
                  onChange={(e) =>
                    setEditableUser({ ...editableUser, bio: e.target.value })
                  }
                  placeholder="Enter bio"
                />
                <button onClick={handleSave}>Save</button>
              </>
            ) : (
              <>
                <h2>{user.username || "No username"}</h2>
                <p className="bio">{user.bio || "No bio provided."}</p>
                <button onClick={() => setEditing(true)}> ✏️ Edit Profile</button>
                <br />
                <br />
                <div className="follow-buttons">
                  <button className="follow-btn" onClick={fetchFollowers}>Followers</button>
                  <button className="follow-btn" onClick={fetchFollowing}>Following</button>
                </div>

                {showFollowers && (
                  <div ref={followersRef} className="follow-dropdown">
                    <h4>Followers</h4>
                    <ul>
                      {followers.length > 0 ? (
                        followers.map((follower, i) => (
                          <li key={i}>{follower.username}</li>
                        ))
                      ) : (
                        <li>No followers yet.</li>
                      )}
                    </ul>
                  </div>
                )}

                {showFollowing && (
                  <div ref={followingRef} className="follow-dropdown">
                    <h4>Following</h4>
                    <ul>
                      {following.length > 0 ? (
                        following.map((followed, i) => (
                          <li key={i}>{followed.username}</li>
                        ))
                      ) : (
                        <li>Not following anyone yet.</li>
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="tab-buttons">
          <button
            className={activeTab === "myBlogs" ? "active" : ""}
            onClick={() => {
              setActiveTab("myBlogs");
              fetchUserProfile();
            }}
          >
            My Blogs
          </button>
          <button
            className={activeTab === "likedBlogs" ? "active" : ""}
            onClick={() => {
              setActiveTab("likedBlogs");
            }}
          >
            Liked Blogs
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="blog-grid">
          {activeTab === "myBlogs" ? (
            Array.isArray(userBlogs) && userBlogs.length === 0 ? (
              <p className="no-blogs">No blogs created yet.</p>
            ) : (
              Array.isArray(userBlogs) && userBlogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  <div className="card-top-bar">
                    <div className="menu-icon" onClick={() => setOpenMenuId(openMenuId === blog._id ? null : blog._id)}>
                      &#8942;
                    </div>
                    {openMenuId === blog._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleUpdate(blog._id)}>Update</button>
                        <button onClick={() => handleDelete(blog._id)}>Delete</button>
                      </div>
                    )}
                  </div>
                  <img src={blog.image} alt={blog.title} />
                  <h3>{blog.title}</h3>
                  <p>{blog.content.substring(0, 100)}...</p>
                </div>
              ))
            )
          ) : (
            Array.isArray(likedBlogs) && likedBlogs.length === 0 ? (
              <p className="no-blogs">No liked blogs yet.</p>
            ) : (
              Array.isArray(likedBlogs) && likedBlogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  <img src={blog.image} alt={blog.title} />
                  <h3>{blog.title}</h3>
                  <p>{blog.content.substring(0, 100)}...</p>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
